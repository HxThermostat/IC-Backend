import { advanceTo, clear, advanceBy } from "jest-date-mock";

import { create, decode, isGenericPayload } from "../auth";

describe("JWT", () => {
  beforeAll(() => {
    advanceTo(new Date(2020, 6, 1, 0, 0, 0));
  });

  afterAll(() => {
    clear();
  });

  test("it creates a valid", () => {
    const payload = {
      userId: "123",
      accessToken: "access",
      email: "example@example.com",
    };
    const issuer = "issuer";

    const jwt = create(payload, issuer);

    const decoded = decode(jwt, issuer, isGenericPayload);

    expect(decoded).toEqual(expect.objectContaining(payload));
  });

  test("it respects token expiration", () => {
    const payload = {
      userId: "123",
      accessToken: "access",
      email: "example@example.com",
    };
    const issuer = "issuer";

    const jwt = create(payload, issuer, "1d");

    // Just over one day
    advanceBy(24 * 60 * 60 * 1000 + 1);

    expect(() => decode(jwt, issuer, isGenericPayload)).toThrow();
  });

  test("it respects the issuer", () => {
    const payload = {
      userId: "123",
      accessToken: "access",
      email: "example@example.com",
    };
    const issuer = "issuer";

    const jwt = create(payload, issuer);

    expect(() => decode(jwt, "invalid", isGenericPayload)).toThrow();
  });
});
