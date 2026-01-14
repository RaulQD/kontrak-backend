export interface EmailAttachment {
  filename: string;
  content: Buffer;
}
export interface SendEmailOptions {
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  attachment?: EmailAttachment;
}
