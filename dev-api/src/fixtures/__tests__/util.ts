import { toPOJO } from "../util";
import { useTestData } from "../../utils/test-utils";

import { User } from "../../data/models";

describe("toPOJO", () => {
  let user: User;

  useTestData();

  beforeEach(async () => {
    const u = await User.findByEmail("klimate@kraftful.com");
    if (!u) throw new Error("Couldn't find user for test");
    user = u;
  });

  it("makes the relevant attributes a POJO", () => {
    const expectedUser = expect.objectContaining({
      id: user.id,
      email: user.email,
      token: user.token,
    });

    expect(user).toEqual(expectedUser);
    expect({ ...user }).not.toEqual(expectedUser);

    expect({ ...toPOJO(user) }).toEqual(expectedUser);
  });
});
