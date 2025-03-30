import config from "../config";
import fs from "fs";
import path from "path";
import hbs from "handlebars";
import emailFooter from "../assets/emailFooter";


interface MailTemplateParams extends Record<string, any> {
  fileName: string;
}

export const mailTemplate = ({ fileName, ...rest }: MailTemplateParams): string => {
  const filePath = path.resolve(__dirname, `../assets/emailTemplates/${fileName}.html`  );
  const file = fs.readFileSync(filePath, "utf8");


  const template = hbs.compile(file, { strict: false });
  return template({
    ...rest,
    WEBSITE_URL: config.FRONTEND_URL,
    LOGO_URL: `${config.FRONTEND_URL}/photos/logo_light.webp`,
    CUSTOMER_CARE_EMAIL: config.CUSTOMER_CARE_EMAIL,
    FOOTER: emailFooter,
  }).toString();
};
