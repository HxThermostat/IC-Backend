import { isValidToken } from "./helpers";

describe("isValidToken for validating pasted token from clipboard", () => {
  it("returns true or false depending on its validity", () => {
    const validToken = isValidToken("qvXmRRfp");
    const validToken2 = isValidToken("1234b678");

    const invalidToken = isValidToken("https://google.com/qvXmRRfp");
    const invalidToken2 = isValidToken("123456789");
    const invalidToken3 = isValidToken("qvXmRRfpZ");
    const invalidToken4 = isValidToken("qvXmRRfpZ qvXmRRfpZ");
    const invalidToken5 = isValidToken("qvXm");
    const invalidToken6 = isValidToken("qvXm mRRfp");
    const invalidToken7 = isValidToken("");

    expect(validToken).toEqual(true);
    expect(validToken2).toEqual(true);

    expect(invalidToken).toEqual(false);
    expect(invalidToken2).toEqual(false);
    expect(invalidToken3).toEqual(false);
    expect(invalidToken4).toEqual(false);
    expect(invalidToken5).toEqual(false);
    expect(invalidToken6).toEqual(false);
    expect(invalidToken7).toEqual(false);
  });
});
