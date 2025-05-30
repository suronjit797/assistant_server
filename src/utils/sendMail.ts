import nodemailer from "nodemailer";
import config from "../config";

interface SendEmailOptions {
  email: string;
  subject: string;
  text: string;
}

const sendEmail = async ({ email, subject, text }: SendEmailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
      ignoreTLS: true,
    });

    // Verify connection configuration
    await transporter.verify();

    const mailOptions = {
      from: `PA <${config.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: text,
    };

    // Send email and wait for response
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

export default sendEmail;
