import buildClient, { TokenContext } from "./client";

import { AYLA_RULE_SERVICE_URL } from "./config";

// Rule Service
// https://docs.aylanetworks.com/reference#rule-service

const client = buildClient({
  prefixUrl: AYLA_RULE_SERVICE_URL + "rulesservice/v1",
});

// Create action
// https://docs.aylanetworks.com/reference#create-action

// There are additional action types that we're not currently
// supporting

export interface CreateActionRequest {
  action: {
    name: string;
    parameters: {
      body: string;
      endpoint: string;
    };
    type: "URL";
  };
}

export interface CreateActionResponse {
  action: {
    action_uuid: string;
    name: string;
    parameters: {
      body: string;
      endpoint: string;
    };
    rule_ids: string[];
  };
}

export const createAction = async (
  json: CreateActionRequest,
  context: TokenContext
): Promise<CreateActionResponse> => {
  const response = await client
    .post("actions", { json, context })
    .json<CreateActionResponse>();

  return response;
};

// Get actions
// https://docs.aylanetworks.com/reference#get-actions

export interface GetActionsResponse {
  actions: Array<{
    action_uuid: string;
    name: string;
    parameters: { body: string; endpoint: string };
    rule_ids: string[];
  }>;
}

export const getActions = async (
  context: TokenContext
): Promise<GetActionsResponse> => {
  const response = await client
    .get("actions", { context })
    .json<GetActionsResponse>();

  return response;
};

// Delete action
// https://docs.aylanetworks.com/reference#delete-action

export const deleteAction = async (
  actionId: string,
  context: TokenContext
): Promise<void> => {
  await client.delete(`actions/${actionId}`, { context });
};

// Create rule
// https://docs.aylanetworks.com/reference#create-rule

export interface CreateRuleRequest {
  rule: {
    name: string;
    description?: string;
    expression: string;
    action_ids: string[];
  };
}

export interface CreateRuleResponse {
  rule: {
    rule_uuid: string;
    name: string;
    expression: string;
    is_enabled: boolean;
    action_ids: string[];
  };
}

export const createRule = async (
  json: CreateRuleRequest,
  context: TokenContext
): Promise<CreateRuleResponse> => {
  const response = await client
    .post("rules", { json, context })
    .json<CreateRuleResponse>();

  return response;
};

// Get rules
// https://docs.aylanetworks.com/reference#get-rules

export type GetRulesRequest =
  | { type: "device"; id: string }
  | { type: "user"; id: string };

export interface GetRulesResponse {
  rules: {
    rule_uuid: string;
    name: string;
    expression: string;
    is_enabled: boolean;
    action_ids: string[];
  }[];
}

export const getRules = async (
  searchParams: GetRulesRequest | undefined,
  context: TokenContext
): Promise<GetRulesResponse> => {
  const response = await client
    .get("rules", { searchParams, context })
    .json<GetRulesResponse>();

  return response;
};

// Update rule
// https://docs.aylanetworks.com/reference#update-rule

export interface UpdateRuleRequest {
  attributes: {
    name?: string;
    expression?: string;
    is_enabled?: boolean;
    action_ids?: string[];
  };
}

export interface UpdateRuleResponse {
  rule: {
    rule_uuid: string;
    name: string;
    expression: string;
    is_enabled: boolean;
    action_ids: string[];
  };
}

export const updateRule = async (
  ruleId: string,
  json: UpdateRuleRequest,
  context: TokenContext
): Promise<UpdateRuleResponse> => {
  const response = await client
    .put(`rules/${ruleId}`, { json, context })
    .json<UpdateRuleResponse>();

  return response;
};

// Delete rule
// https://docs.aylanetworks.com/reference#delete-rule

export const deleteRule = async (
  ruleId: string,
  context: TokenContext
): Promise<void> => {
  await client.delete(`rules/${ruleId}`, { context });
};
