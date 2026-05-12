export interface TemplateConfiguration {
  appName: string;
  backgroundColor: string;
  buttonBackgroundColor: string;
  buttonBackgroundHoverColor: string;
  buttonStrokeColor: string;
  buttonTextColor: string;
  colorScheme: "light" | "dark";
  customerName: string;
  customerUrl: string;
  footerBackgroundColor: string;
  iconAlt: string;
  iconUrl: string;
  textColor: string;
}

export default function render({
  subject,
  preview: previewText,
  body,
  config,
}: {
  subject: string;
  preview?: string;
  body: string;
  config: TemplateConfiguration;
}): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="utf-8" />
  <!-- utf-8 works for most cases -->
  <meta name="viewport" content="width=device-width" />
  <!-- Forcing initial-scale shouldn't be necessary -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!-- Use the latest (edge) version of IE rendering engine -->
  <meta name="x-apple-disable-message-reformatting" />
  <!-- Disable auto-scale in iOS 10 Mail entirely -->
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <!-- Tell iOS not to automatically link certain text strings. -->
  <meta name="color-scheme" content="${config.colorScheme}" />
  <meta name="supported-color-schemes" content="${config.colorScheme}" />
  <title>${subject}${previewText ? " " + previewText : ""}</title>
  <!--   The title tag shows in email notifications, like Android 4.4. -->

  <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
  <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->

  <!-- CSS Reset : BEGIN -->
  <style data-embed>
    /* What it does: Tells the email client that only dark/light styles are provided but the client can transform them to light. A duplicate of meta color-scheme meta tag above. */
    :root {
      color-scheme: ${config.colorScheme};
      supported-color-schemes: ${config.colorScheme};
    }

    /* What it does: Remove spaces around the email design added by some email clients. */
    /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
    html,
    body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
    }

    /* What it does: Stops email clients resizing small text. */
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    /* What it does: Centers email on Android 4.4 */
    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }

    /* What it does: forces Samsung Android mail clients to use the entire viewport */
    #MessageViewBody,
    #MessageWebViewDiv {
      width: 100% !important;
    }

    /* What it does: Stops Outlook from adding extra spacing to tables. */
    table,
    td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }

    /* What it does: Fixes webkit padding issue. */
    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
    }

    /* What it does: Uses a better rendering method when resizing images in IE. */
    img {
      -ms-interpolation-mode: bicubic;
    }

    /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
    a {
      text-decoration: none;
    }

    /* What it does: A work-around for email clients meddling in triggered links. */
    a[x-apple-data-detectors],
    /* iOS */
    .unstyle-auto-detected-links a,
    .aBn {
      border-bottom: 0 !important;
      cursor: default !important;
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
    .a6S {
      display: none !important;
      opacity: 0.01 !important;
    }

    /* What it does: Prevents Gmail from changing the text color in conversation threads. */
    .im {
      color: inherit !important;
    }

    /* If the above doesn't work, add a .g-img class to any image in question. */
    img.g-img+div {
      display: none !important;
    }

    /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
    /* Create one of these media queries for each additional viewport size you'd like to fix */

    /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
    @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
      u~div .email-container {
        min-width: 320px !important;
      }
    }

    /* iPhone 6, 6S, 7, 8, and X */
    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      u~div .email-container {
        min-width: 375px !important;
      }
    }

    /* iPhone 6+, 7+, and 8+ */
    @media only screen and (min-device-width: 414px) {
      u~div .email-container {
        min-width: 414px !important;
      }
    }
  </style>
  <!-- CSS Reset : END -->

  <!-- Progressive Enhancements : BEGIN -->
  <style data-embed>
    /* What it does: Hover styles for buttons */
    .button-td,
    .button-a {
      transition: all 100ms ease-in;
    }

    .button-td-primary:hover,
    .button-a-primary:hover {
      background: ${config.buttonBackgroundHoverColor} !important;
      border-color: ${config.buttonBackgroundHoverColor} !important;
    }

    /* Media Queries */
    @media screen and (max-width: 600px) {

      /* What it does: Adjust typography on small screens to improve readability */
      .email-container p {
        font-size: 17px !important;
      }
    }
  </style>
  <!-- Progressive Enhancements : END -->
</head>
<!--
	The email background color is defined in three places:
	1. body tag: for most email clients
	2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr
	3. mso conditional: For Windows 10 Mail
-->

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: ${
    config.backgroundColor
  };">
  <center role="article" aria-roledescription="email" lang="en" style="width: 100%; background-color: ${
    config.backgroundColor
  };">
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${
      config.backgroundColor
    };">
    <tr>
    <td>
    <![endif]-->

    ${previewText ? preview(previewText) : ""}

    <!--
            Set the email width. Defined in two places:
            1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.
            2. MSO tags for Desktop Windows Outlook enforce a 600px width.
        -->
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
      <!--[if mso]>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
            <tr>
            <td>
            <![endif]-->

      <!-- Email Body : BEGIN -->
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="margin: auto;">
        <!-- 1 Column Text + Button : BEGIN -->
        <tr>
          <td>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              ${body}              
            </table>
          </td>
        </tr>
        <!-- 1 Column Text + Button : END -->
        
        <!-- Email Body : END -->
      </table>
      <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
    </div>

    <!-- Full Bleed Background Section : BEGIN -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="background-color: ${config.footerBackgroundColor};">
      <tr>
        <td>
          <div align="center" style="max-width: 600px; margin: auto;" class="email-container">
            <!--[if mso]>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                        <tr>
                        <td>
                        <![endif]-->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding: 30px 0 0; text-align: center">
                  <img src="${config.iconUrl}" width="60" height="60" alt="${
    config.iconAlt
  }" border="0"
                    style="height: auto; background: ${
                      config.footerBackgroundColor
                    }; font-family: -apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif; font-size: 24px !important; line-height: 60px; text-align: center; color: ${
    config.textColor
  };">
                </td>
              </tr>
              <tr>
                <td
                  style="padding: 16px 0; text-align: center; font-family: -apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px !important; font-weight: 600; line-height: 20px; color: ${
                    config.textColor
                  };">
                  <p style="margin: 0;">
                    ${config.appName}
                  </p>
                </td>
              </tr>
              <tr>
                <td
                  style="text-align: center; font-family: -apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px !important; font-weight: 200; line-height: 20px; color: ${
                    config.textColor
                  };">
                  <p style="margin: 0;">
                    ${config.customerName}
                  </p>
                </td>
              </tr>
              <tr>
                <td
                  style="text-align: center; font-family: -apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px !important; line-height: 20px; color: ${
                    config.textColor
                  };">
                  <p style="margin: 0;">
                    <a style="text-decoration: none; color: ${config.textColor}"
                      href="${config.customerUrl}">${config.customerUrl}</a>
                  </p>
                </td>
              </tr>
              ${spacer()}
            </table>

            <!--[if mso]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
          </div>
        </td>
      </tr>
    </table>



    <!-- Full Bleed Background Section : END -->

    <!--[if mso | IE]>
    </td>
    </tr>
    </table>
    <![endif]-->
  </center>
</body>

</html>
`;
}

function preview(str: string): string {
  return `
    <!-- Visually Hidden Preheader Text : BEGIN -->
    <div style="max-height:0; overflow:hidden; mso-hide:all;" aria-hidden="true">
      ${str}
    </div>
    <!-- Visually Hidden Preheader Text : END -->

    <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->
    <!-- Preview Text Spacing Hack : BEGIN -->
    <div
      style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: -apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif;">
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>
    <!-- Preview Text Spacing Hack : END -->
`;
}

export function spacer(): string {
  return `<!-- Clear Spacer : BEGIN -->
        <tr>
          <td aria-hidden="true" height="50" style="font-size: 0px; line-height: 0px;">
            &nbsp;
          </td>
        </tr>
        <!-- Clear Spacer : END -->`;
}

export function button({
  label,
  url,
  config,
}: {
  label: string;
  url: string;
  config: TemplateConfiguration;
}): string {
  return `<tr>
                <td style="padding: 0 20px;">
                  <!-- Button : BEGIN -->
                  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0"
                    style="margin: auto;">
                    <tr>
                      <td class="button-td button-td-primary" style="border-radius: 24px; background: ${config.backgroundColor};">
                        <a class="button-a button-a-primary"
                          href="${url}"
                          style="background: ${config.buttonBackgroundColor}; border: 1px solid ${config.buttonStrokeColor}; font-family: -apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif; font-size: 15px !important; font-weight: 600; line-height: 15px; text-decoration: none; padding: 14px 24px; color: ${config.buttonTextColor}; display: block; border-radius: 24px;">${label}</a>
                      </td>
                    </tr>
                  </table>
                  <!-- Button : END -->
                </td>
              </tr>`;
}

export function textRow({
  text,
  config,
  marginBottom = 15,
  fontSize = 15,
  lineHeight = 20,
  extraStyle = "",
}: {
  text: string;
  config: TemplateConfiguration;
  extraStyle?: string;
  fontSize?: number;
  lineHeight?: number;
  marginBottom?: number;
}): string {
  return `<tr>
                <td
                  style="padding: 20px; font-family: -apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif; font-size: ${fontSize}px !important; line-height: ${lineHeight}px; color: ${config.textColor}; ${extraStyle}">
                  <p style="margin: 0 0 ${marginBottom}px;">
                    ${text}
                  </p>
                </td>
              </tr>`;
}
