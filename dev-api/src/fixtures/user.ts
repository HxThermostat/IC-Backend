import {
  User,
  UserAttributes,
  UserCreationAttributes,
} from "../data/models/User";

import { toPOJO, WithoutModel } from "./util";

export type UserRecord = WithoutModel<UserAttributes>;

export const addUser = async (
  user: UserCreationAttributes
): Promise<UserRecord> => toPOJO(await User.create(user));

export const findUserByEmail = async (
  email: string
): Promise<UserRecord | undefined> => {
  const user = await User.findByEmail(email);

  return user ? toPOJO(user) : undefined;
};

export const findUserById = async (
  id: string
): Promise<UserRecord | undefined> => {
  const user = await User.findByPk(id);

  return user ? toPOJO(user) : undefined;
};

export const removeUser = async (id: string): Promise<UserRecord> => {
  const found = await User.findByPk(id);

  if (!found) {
    throw new Error(`Unable to find User with id: ${id}`);
  }

  await found.destroy();

  return toPOJO(found);
};
