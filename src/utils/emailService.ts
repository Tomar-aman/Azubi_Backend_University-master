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
    const port = Number(smtpInfo?.port ?? process.env.EMAIL_PORT ?? 465);
    const host = smtpInfo?.host ?? process.env.EMAIL_HOST ?? "smtp.strato.de";
    const user = smtpInfo?.userName ?? process.env.EMAIL_USER ?? "";
    const pass = smtpInfo?.password ?? process.env.EMAIL_PASS ?? "";
    const service = smtpInfo?.service ?? process.env.EMAIL_SERVICE ?? "";

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,   // true for 465 (SSL), false for 587 (STARTTLS)
      ...(service ? { service } : {}),
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false, // Accept Strato's self-signed/intermediate cert
      },
    });
    this.fromEmail = smtpInfo?.userName ?? (process.env.EMAIL_FROM as string) ?? user;
  }

  async updateFromEmail(fromEmail: string) {
    this.fromEmail = fromEmail;
  }

  async sendEmail(options: EmailOptions) {
    try {
      // Safety guard: re-init if transporter wasn't set up yet
      if (!this.transporter) {
        await this.init();
      }

      const { subject, text, html, bcc, to, attachments } = options;
      const mailOptions = {
        from: this.fromEmail,
        to: to?.join(", "),   // FIX: was missing — nodemailer needs this to send
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
