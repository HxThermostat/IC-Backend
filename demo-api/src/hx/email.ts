import { Email } from "ayla-client";

import render, {
  button,
  textRow,
  spacer,
  TemplateConfiguration,
} from "../email";

const config: TemplateConfiguration = {
  appName: "Hx",
  backgroundColor: "#F1F1F1",
  buttonBackgroundColor: "#007AFF",
  buttonBackgroundHoverColor: "#007AFF",
  buttonStrokeColor: "#007AFF",
  buttonTextColor: "#F1F1F1",
  colorScheme: "light",
  customerName: "Kraftful, Inc.",
  customerUrl: "www.kraftful.com",
  footerBackgroundColor: "#F4F5F5",
  iconAlt: "72",
  iconUrl: `${process.env.APP_URL}/app-icon-256.png`,
  textColor: "#181718",
};

const TEMPLATE_ID = "jci_hx_kraftful_template";

export default {
  signIn: (userEmail: string): Email => {
    const token = "[[user_password_reset_token]][[user_confirmation_token]]";
    const subject = `${config.appName} confirmation code: ${token}`;

    return {
      email_template_id: TEMPLATE_ID,
      email_subject: subject,
      email_body_html: render({
        subject,
        preview: `Tap or enter code to sign in to the ${config.appName} app.`,
        body: `
      ${textRow({
        text: `To sign in to your ${config.appName} app, please confirm your email address.`,
        marginBottom: 0,
        config,
      })}
      ${spacer()}
      ${button({
        label: "Sign in",
        url: `${process.env.APP_URL}/signIn/${userEmail.trim()}/${token}`,
        config,
      })}
      ${spacer()}
      ${textRow({
        text: `If the button above doesn't work, you can manually enter this code in your ${config.appName} app:`,
        config,
      })}
      ${textRow({
        text: token,
        extraStyle:
          "font-weight: 300; letter-spacing: 4px; text-align: center;",
        fontSize: 20,
        lineHeight: 22,
        marginBottom: 30,
        config,
      })}
      `,
        config,
      }),
    };
  },
};
