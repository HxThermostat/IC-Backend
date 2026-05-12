import {
  PushToken,
  PushTokenAttributes,
  PushTokenCreationAttributes,
} from "../data/models/PushToken";

import { toPOJO, WithoutModel } from "./util";

export type PushTokenRecord = WithoutModel<PushTokenAttributes>;

export const loadPushTokens = async (
  userId: string
): Promise<PushTokenRecord[]> =>
  (await PushToken.findAll({ where: { userId } })).map(toPOJO);

export const addPushToken = async (
  token: PushTokenCreationAttributes
): Promise<PushTokenRecord> => {
  let created: PushToken;

  try {
    created = await PushToken.create(token);
  } catch (e) {
    // We're going to be a bit lazy and assume this is a
    // UniqueConstraintError
    const found = await PushToken.findByToken(token.token);

    if (found) {
      created = found;
    } else {
      throw e;
    }
  }

  return toPOJO(created);
};

export const removePushToken = async (
  id: string
): Promise<PushTokenRecord | undefined> => {
  const found = await PushToken.findByPk(id);

  if (!found) {
    throw new Error(`Unable to find PushToken with id: ${id}`);
  }

  await found.destroy();

  return toPOJO(found);
};
