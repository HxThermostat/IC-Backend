import { useTestData } from "../../utils/test-utils";
import { User } from "../models";

describe("Models", () => {
  useTestData();

  describe("User", () => {
    it("can findByEmail", async () => {
      const email = "klimate@kraftful.com";
      const found = await User.findByEmail(email);

      expect(found).toBeDefined();
      expect(found?.get("email")).toBe(email);
    });
  });
});
