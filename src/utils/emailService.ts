import nodemailer, { type SentMessageInfo } from "nodemailer";
import logger from "./logger";
import { smtpSettingModel } from "../models/index";

interface EmailOptions {
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  to?: string[];
  // eslint-disable-next-line @typescript-eslint/array-type
  attachments?: { filename: string; content: Buffer }[];
}
// interface TransportOptions {
//   service: string;
//   host: string;
//   tls: {
//     rejectUnauthorized: boolean;
//   };
//   secure: boolean;
//   port: number;
//   auth: {
//     user: string;
//     pass: string;
//   };
// }

class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;
  private fromEmail: string;
  constructor(fromEmail?: string) {
    this.fromEmail = fromEmail ?? "";
  }

  async init() {
    const smtpInfo = await smtpSettingModel.findOne();
    this.transporter = nodemailer.createTransport({
      // ...options,
      // @ts-ignore
      host: smtpInfo?.host ?? process.env.EMAIL_HOST,
      port: smtpInfo?.port ?? process.env.EMAIL_PORT,
      secure: true,
      tls: true,
      service: smtpInfo?.service ?? process.env.EMAIL_SERVICE,
      auth: {
        user: smtpInfo?.userName ?? process.env.EMAIL_USER,
        pass: smtpInfo?.password ?? process.env.EMAIL_PASS,
      },
    });
    this.fromEmail = smtpInfo?.userName ?? (process.env.EMAIL_FROM as string);
  }

  async updateFromEmail(fromEmail: string) {
    this.fromEmail = fromEmail;
  }

  async sendEmail(options: EmailOptions) {
    try {
      const { subject, text, html, bcc, attachments } = options;
      const mailOptions = {
        from: this.fromEmail,
        bcc,
        subject,
        text,
        html,
        attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Message sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error("fail to send:", error);
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info("Email Service is up and running 🚀🚀🚀");
    } catch (error) {
      logger.error("Email Service is down ☹️: ", error);
    }
  }
}
const emailService = new EmailService();
export default emailService;
