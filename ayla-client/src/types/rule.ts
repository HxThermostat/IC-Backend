export interface AylaAction {
  id: string;
  name: string;
  parameters: { body: Record<string, string>; endpoint: string };
  ruleIds: string[];
}

type AylaRuleBasicExpression = {
  subject: AylaRuleSubject;
  operator: AylaRuleOperator;
  constant: string | number;
};

type AylaRuleFunctionExpression = { subject: AylaRuleFunctionSubject };

export type AylaRuleSingleExpression =
  | AylaRuleBasicExpression
  | AylaRuleFunctionExpression;

export type AylaRuleExpression =
  | AylaRuleSingleExpression
  | AylaRuleCompoundExpression
  | AylaRuleConstantExpression;

export interface AylaRuleCompoundExpression {
  left: AylaRuleExpression;
  operator: AylaRuleOperator;
  right: AylaRuleExpression;
}

interface BaseAylaRuleSubject<
  SubjectType extends AylaRuleSubjectType,
  Arguments extends Array<string | AylaRuleSubject>
> {
  subjectType: SubjectType;
  args: Arguments;
}

export type AylaRuleSubjectActivation = BaseAylaRuleSubject<
  AylaRuleSubjectType.ACTIVATION,
  [string, "activated" | "deactivated"]
>;

export type AylaRuleSubjectConnectivity = BaseAylaRuleSubject<
  AylaRuleSubjectType.CONNECTION,
  [string, "online" | "offline" | "all"]
>;

export type AylaRuleSubjectDatapoint = BaseAylaRuleSubject<
  AylaRuleSubjectType.DATAPOINT,
  [string, string]
>;

export type AylaRuleSubjectLocation = BaseAylaRuleSubject<
  AylaRuleSubjectType.CONNECTION,
  [string]
>;

export type AylaRuleSubjectRegistration = BaseAylaRuleSubject<
  AylaRuleSubjectType.REGISTRATION,
  [string, "true" | "false" | "all"]
>;

export type AylaRuleSubjectChanged = BaseAylaRuleSubject<
  AylaRuleSubjectType.CHANGED,
  [AylaRuleSubject]
>;

export type AylaRuleSubjectStrContains = BaseAylaRuleSubject<
  AylaRuleSubjectType.STR_CONTAINS,
  [AylaRuleSubject, string]
>;

export type AylaRuleSubjectStrEquals = BaseAylaRuleSubject<
  AylaRuleSubjectType.STR_EQUALS,
  [AylaRuleSubject, string]
>;

export type AylaRuleBasicSubject =
  | AylaRuleSubjectActivation
  | AylaRuleSubjectConnectivity
  | AylaRuleSubjectDatapoint
  | AylaRuleSubjectLocation
  | AylaRuleSubjectRegistration;

export type AylaRuleFunctionSubject =
  | AylaRuleSubjectChanged
  | AylaRuleSubjectStrContains
  | AylaRuleSubjectStrEquals;

export type AylaRuleSubject = AylaRuleBasicSubject | AylaRuleFunctionSubject;

export enum AylaRuleSubjectType {
  ACTIVATION = "ACTIVATION",
  CONNECTION = "CONNECTION",
  DATAPOINT = "DATAPOINT",
  LOCATION = "LOCATION",
  REGISTRATION = "REGISTRATION",
  CHANGED = "changed",
  STR_CONTAINS = "str_contains",
  STR_EQUALS = "str_equals",
}

export enum AylaRuleOperator {
  AND = "&&",
  OR = "||",
  GT = ">",
  GTE = ">=",
  LT = "<",
  LTE = "<=",
  EQ = "==",
  "+" = "+",
  "-" = "-",
  "*" = "*",
  "/" = "/",
  "=" = "=",
}

export enum AylaRuleConstantExpression {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

export function isBasicExpression(
  expression: unknown
): expression is AylaRuleBasicExpression {
  if (typeof expression !== "object") return false;
  if (expression == null) return false;

  return (
    typeof (expression as AylaRuleBasicExpression).operator !== "undefined"
  );
}

export function isCompoundExpression(
  expression: unknown
): expression is AylaRuleCompoundExpression {
  if (typeof expression !== "object") return false;
  if (expression == null) return false;

  return typeof (expression as AylaRuleCompoundExpression).left === "object";
}

export interface AylaRule {
  actionIds: string[];
  enabled: boolean;
  expression: string;
  id: string;
  name: string;
}

export type AylaRuleTemplate<
  T extends AylaRuleExpression = AylaRuleExpression
> = Omit<AylaRule, "id" | "expression"> & {
  expression: T;
};

// This is *our* view of the types of Rules we'll be creating
export enum AylaRuleTypes {
  CHANGE = "CHANGE",
  RANGE = "RANGE",
}
