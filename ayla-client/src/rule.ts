import { isEqual } from "lodash";
import { ValuesType } from "utility-types";

import { TokenContext } from "./core/client";

import * as rulesClient from "./core/rules";

import {
  AylaAction,
  AylaRule,
  AylaRuleCompoundExpression,
  AylaRuleConstantExpression,
  AylaRuleExpression,
  AylaRuleOperator,
  AylaRuleSubject,
  AylaRuleSubjectType,
  AylaRuleTemplate,
  AylaRuleTypes,
  isBasicExpression,
  isCompoundExpression,
} from "./types";

export async function addAction({
  name,
  parameters,
  ...context
}: {
  name: string;
  parameters: { endpoint: string; body: Record<string, string> };
} & TokenContext): Promise<AylaAction> {
  const { action } = await rulesClient.createAction(
    {
      action: {
        name: name.toUpperCase(),
        type: "URL",
        parameters: {
          ...parameters,
          body: JSON.stringify({
            name: name.toUpperCase(),
            dsn: "{{event.metadata.dsn}}",
            userId: "{{event.user_uuid}}",
            propertyName: "{{event.metadata.property_name}}",
            value: "{{event.datapoint.value}}",
            valueType: "{{event.metadata.base_type}}",
            ...parameters.body,
          }),
        },
      },
    },
    context
  );

  return {
    id: action.action_uuid,
    name: action.name,
    parameters: {
      endpoint: action.parameters.endpoint,
      body: JSON.parse(action.parameters.body) as Record<string, string>,
    },
    ruleIds: action.rule_ids,
  };
}

export async function addRule({
  expression,
  name,
  actionIds = [],
  ...context
}: {
  actionIds?: string[];
  expression: AylaRuleExpression | string;
  name: string;
} & TokenContext): Promise<AylaRule> {
  const { rule } = await rulesClient.createRule(
    {
      rule: {
        name: name.toUpperCase(),
        expression: serializeExpression(expression),
        action_ids: actionIds,
      },
    },
    context
  );

  return {
    actionIds: rule.action_ids,
    enabled: rule.is_enabled,
    expression: rule.expression,
    id: rule.rule_uuid,
    name: rule.name,
  };
}

export function buildRuleName({
  dsn,
  ruleType,
  propertyName,
}: {
  dsn: string;
  ruleType: AylaRuleTypes;
  propertyName: string;
}): string {
  return [dsn, ruleType, propertyName].join(".").toUpperCase();
}

export async function findOrCreateAction({
  name,
  parameters,
  ...context
}: {
  name: string;
  parameters: { endpoint: string; body: Record<string, string> };
} & TokenContext): Promise<AylaAction> {
  let action = (await getActions(context)).find(
    (action) => action.name === name
  );

  if (!action) {
    action = await addAction({ name, parameters, ...context });
  }

  return action;
}

export async function getAction({
  name,
  ...context
}: { name: string } & TokenContext): Promise<AylaAction | undefined> {
  try {
    const action = (await getActions(context)).find(
      (action) => action.name === name
    );

    return action ?? undefined;
  } catch {
    return;
  }
}

export async function getActions(context: TokenContext): Promise<AylaAction[]> {
  const rules = (await rulesClient.getActions(context)).actions.map(
    (action) => ({
      id: action.action_uuid,
      name: action.name,
      parameters: {
        body: JSON.parse(action.parameters.body) as Record<string, string>,
        endpoint: action.parameters.endpoint,
      },
      ruleIds: action.rule_ids,
    })
  );

  return rules;
}

export async function getRule({
  name,
  ...context
}: { name: string } & TokenContext): Promise<AylaRule | undefined> {
  try {
    const rule = (await getRules(context)).find((rule) => rule.name === name);

    return rule ?? undefined;
  } catch {
    return;
  }
}

export async function getRules(context: TokenContext): Promise<AylaRule[]> {
  const rules = (await rulesClient.getRules(undefined, context)).rules.map(
    (rule) => ({
      actionIds: rule.action_ids,
      enabled: rule.is_enabled,
      expression: rule.expression,
      id: rule.rule_uuid,
      name: rule.name,
    })
  );

  return rules;
}

export async function toggleRule({
  enabled,
  defaultRule: { actionIds, expression, name },
  ...context
}: {
  enabled: boolean;
  defaultRule: AylaRuleTemplate;
} & TokenContext): Promise<AylaRule> {
  let rule = await findOrCreateRule({
    defaultRule: { actionIds, expression, name },
    ...context,
  });

  if (enabled !== rule.enabled) {
    rule = await updateRule({
      id: rule.id,
      enabled,
      ...context,
    });
  }

  return rule;
}

export async function updateRuleExpression({
  expression,
  defaultRule: { actionIds, name },
  ...context
}: {
  expression: AylaRuleExpression;
  defaultRule: AylaRuleTemplate;
} & TokenContext): Promise<AylaRule> {
  let rule = await findOrCreateRule({
    defaultRule: { actionIds, expression, name },
    ...context,
  });

  if (serializeExpression(expression) !== rule.expression) {
    rule = await updateRule({
      id: rule.id,
      expression,
      ...context,
    });
  }

  return rule;
}

export async function upsertRule({
  updates,
  defaultRule,
  ...context
}: {
  updates: Partial<AylaRuleTemplate>;
  defaultRule: AylaRuleTemplate;
} & TokenContext): Promise<AylaRule> {
  let rule = await findOrCreateRule({
    defaultRule,
    ...context,
  });

  let changed = false;

  changed ||= updates.actionIds
    ? !isEqual(updates.actionIds, rule.actionIds)
    : false;
  changed ||= updates.enabled != null ? updates.enabled != rule.enabled : false;
  changed ||= updates.expression
    ? serializeExpression(updates.expression) !==
      serializeExpression(rule.expression)
    : false;
  changed ||= updates.name ? updates.name !== rule.name : false;

  if (changed) {
    rule = await updateRule({
      id: rule.id,
      ...updates,
      ...context,
    });
  }

  return rule;
}

export function buildChangedExpression({
  dsn,
  propertyName,
}: {
  dsn: string;
  propertyName: string;
}): AylaRuleCompoundExpression {
  return {
    left: {
      subject: subject(AylaRuleSubjectType.STR_EQUALS, [
        subject(AylaRuleSubjectType.CHANGED, [
          subject(AylaRuleSubjectType.DATAPOINT, [dsn, propertyName]),
        ]),
        "ANY",
      ]),
    },
    operator: AylaRuleOperator.OR,
    right: AylaRuleConstantExpression.TRUE,
  };
}

export function buildCompoundExpression(
  expressions: AylaRuleExpression[],
  operator: AylaRuleOperator
): AylaRuleExpression {
  if (expressions.length === 1) return expressions[0];

  return {
    left: expressions[0],
    right: buildCompoundExpression(expressions.slice(1), operator),
    operator,
  };
}

export function buildRangeExpression({
  dsn,
  maximum,
  minimum,
  propertyName,
  inclusive = false,
}: {
  dsn: string;
  inclusive?: boolean;
  maximum: number;
  minimum: number;
  propertyName: string;
}): AylaRuleCompoundExpression {
  return {
    left: {
      subject: subject(AylaRuleSubjectType.DATAPOINT, [dsn, propertyName]),
      operator: inclusive ? AylaRuleOperator.LTE : AylaRuleOperator.LT,
      constant: minimum,
    },
    operator: AylaRuleOperator.OR,
    right: {
      subject: subject(AylaRuleSubjectType.DATAPOINT, [dsn, propertyName]),
      operator: inclusive ? AylaRuleOperator.GTE : AylaRuleOperator.GT,
      constant: maximum,
    },
  };
}

export function extractChangedExpression(
  expression: string
): { dsn: string; propertyName: string } | undefined {
  return (
    (/changed/i.test(expression) && extractDatapoint(expression)) || undefined
  );
}

export function extractRangeExpression(
  expression: string | AylaRuleExpression
):
  | {
      dsn: string;
      inclusive: boolean;
      maximum: number;
      minimum: number;
      propertyName: string;
    }
  | undefined {
  expression = serializeExpression(expression);
  const datapoint = extractDatapoint(expression);
  if (!datapoint) return;

  const thresholds = extractThresholds(expression);
  if (!thresholds) return;

  return {
    ...datapoint,
    ...thresholds,
    inclusive: /[<>]=/.test(expression),
  };
}

// Internal helpers

function extractDatapoint(
  expression: string
): { dsn: string; propertyName: string } | undefined {
  const match = /datapoint\(([^,]+), ?([^)]+)\)/i.exec(expression);

  if (match == null) return;

  return {
    dsn: match[1],
    propertyName: match[2],
  };
}

function extractThresholds(
  expression: string
): { maximum: number; minimum: number } | undefined {
  // DATAPOINT(SOMEDSN, IDTmp1) < 60 ||  DATAPOINT(SOMEDSN, IDTmp1) > 80
  const maximum = /DATAPOINT\([a-zA-Z0-9]+, [a-zA-Z0-9]+\) >=? (?<maximum>[0-9]+)/gi.exec(
    expression
  )?.groups?.["maximum"];
  const minimum = /DATAPOINT\([a-zA-Z0-9]+, [a-zA-Z0-9]+\) <=? (?<minimum>[0-9]+)/gi.exec(
    expression
  )?.groups?.["minimum"];

  if (!maximum || !minimum) return;

  return { maximum: parseFloat(maximum), minimum: parseFloat(minimum) };
}

async function findOrCreateRule({
  defaultRule: { actionIds, expression, name },
  ...context
}: {
  defaultRule: Omit<AylaRuleTemplate, "enabled">;
} & TokenContext): Promise<AylaRule> {
  let rule = await getRule({ name, ...context });

  if (rule == null) {
    rule = await addRule({ actionIds, expression, name, ...context });
  }

  return rule;
}

function serializeArguments(
  subjectType: AylaRuleSubjectType,
  args: Array<ValuesType<AylaRuleSubject["args"]>>
): string {
  return args
    .map((arg) => {
      if (typeof arg === "object") {
        return serializeSubject(arg);
      } else {
        return [
          AylaRuleSubjectType.STR_CONTAINS,
          AylaRuleSubjectType.STR_EQUALS,
        ].includes(subjectType)
          ? `'${arg}'`
          : arg;
      }
    })
    .join(", ");
}

function serializeExpression(expression: AylaRuleExpression | string): string {
  if (typeof expression === "string") return expression;

  // Take care of any of the constant expressions right off the bat so
  // we can tighten the type constraint below
  if (
    Object.values(AylaRuleConstantExpression).includes(
      (expression as unknown) as AylaRuleConstantExpression
    )
  ) {
    return (expression as unknown) as string;
  }

  if (isCompoundExpression(expression)) {
    return `${serializeExpression(expression.left)} ${
      expression.operator
    } ${serializeExpression(expression.right)}`;
  }

  if (isBasicExpression(expression)) {
    return `${serializeSubject(expression.subject)} ${expression.operator} ${
      expression.constant
    }`;
  } else {
    return `${serializeSubject(expression.subject)}`;
  }
}

function serializeSubject(subject: AylaRuleSubject): string {
  return `${subject.subjectType}(${serializeArguments(
    subject.subjectType,
    subject.args
  )})`;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
function subject<
  SubjectType extends AylaRuleSubject["subjectType"],
  ArgsType extends Extract<
    AylaRuleSubject,
    { subjectType: SubjectType }
  >["args"]
>(subjectType: SubjectType, args: ArgsType) {
  return {
    subjectType,
    args,
  };
}

async function updateRule({
  actionIds,
  enabled,
  expression,
  id,
  ...context
}: {
  id: string;
} & Partial<{
  actionIds: string[];
  enabled: boolean;
  expression: AylaRuleExpression | string;
  name: string;
}> &
  TokenContext): Promise<AylaRule> {
  const { rule } = await rulesClient.updateRule(
    id,
    {
      attributes: {
        action_ids: actionIds,
        expression: expression && serializeExpression(expression),
        is_enabled: enabled,
      },
    },
    context
  );

  return {
    actionIds: rule.action_ids,
    enabled: rule.is_enabled,
    expression: rule.expression,
    id: rule.rule_uuid,
    name: rule.name,
  };
}
