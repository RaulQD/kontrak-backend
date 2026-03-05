import nodemailer, { Transporter } from 'nodemailer';
import { emailConfig } from './email.config';

let transporter: Transporter | null = null;

export const getEmailTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }
  return transporter;
};
export const getFromAddress = (): string => emailConfig.from;
