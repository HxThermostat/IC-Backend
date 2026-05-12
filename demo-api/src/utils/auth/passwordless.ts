import { createHmac, randomBytes } from "crypto";

import { PASSWORD_LENGTH, PASSWORD_SALT } from "./config";

export const generateKsid = (): string => randomBytes(32).toString("hex");

export const generatePassword = ({
  email,
  ksid,
  scheme = "alphanum",
}: {
  email: string;
  ksid?: string;
  scheme?: "alphanum";
}): string => {
  let password: string;

  let counter = 0;
  let valid = false;
  do {
    const hmac = createHmac("sha256", PASSWORD_SALT);

    hmac.update(email);

    if (ksid) hmac.update(ksid);

    hmac.update((counter += 1).toString());

    const digest = hmac.digest("base64");

    switch (scheme) {
      case "alphanum": {
        let offset = 0;
        do {
          password = digest.slice(offset, PASSWORD_LENGTH);

          if (password.length < PASSWORD_LENGTH) break;

          valid =
            !!/[A-Z]/.exec(password) &&
            !!/[a-z]/.exec(password) &&
            !!/[0-9]/.exec(password) &&
            !!/^[A-Za-z0-9]+$/.exec(password);

          offset += 1;
        } while (!valid);
        break;
      }
    }
  } while (!valid);

  return password;
};
