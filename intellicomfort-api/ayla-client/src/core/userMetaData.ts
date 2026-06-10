import buildClient, { TokenContext } from "./client";
import { AYLA_USER_SERVICE_URL } from "./config";

// User MetaData
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/UserMetaData.json/

const client = buildClient({
  prefixUrl: AYLA_USER_SERVICE_URL + "api/v1/users",
});

// User Data
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/UserMetaData.json/getUserDatum

export type UserDataResponse = {
  datum: {
    key: string;
    value: string;
  };
}[];

export const userData = async (
  context: TokenContext
): Promise<UserDataResponse> => {
  const response = await client
    .get("data", { context })
    .json<UserDataResponse>();

  return response;
};

// Create New Datum
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/UserMetaData.json/getDataList

export interface CreateNewDatumRequest {
  datum: {
    key: string;
    value: string;
  };
}

export const createNewDatum = async (
  json: CreateNewDatumRequest,
  context: TokenContext
): Promise<void> => {
  await client.post("data", { json, context });
};

// Update Specific Datum
// https://developer.aylanetworks.com/apibrowser/swaggers/UserService#!/UserMetaData.json/putData

export interface UpdateSpecificDatumRequest {
  datum: {
    value: string;
  };
}

export const updateSpecificDatum = async (
  key: string,
  json: UpdateSpecificDatumRequest,
  context: TokenContext
): Promise<void> => {
  await client.put(`data/${key}`, { json, context });
};
