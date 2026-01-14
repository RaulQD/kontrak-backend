import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';
import { SendEmailOptions } from '../types/email.types';
export class BrevoEmailService {
  private getInstance: TransactionalEmailsApi;
  constructor() {
    this.getInstance = new TransactionalEmailsApi();
    this.getInstance.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.SMTP_BREVO_API_KEY || '',
    );
  }
  async sendEmailWithAttachment(options: SendEmailOptions): Promise<void> {
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.to = options.to.map((to) => ({ email: to }));
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.body;
    sendSmtpEmail.sender = {
      email: 'raul.g.quispe@gmail.com',
      name: 'Kontrak',
    };
    if (options.attachment) {
      sendSmtpEmail.attachment = [
        {
          name: options.attachment.filename,
          content: options.attachment.content.toString('base64'),
        },
      ];
    }
    if (options.cc) {
      sendSmtpEmail.cc = options.cc.map((cc) => ({ email: cc }));
    }
    await this.getInstance.sendTransacEmail(sendSmtpEmail);
  }
}
