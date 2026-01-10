export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}
export interface SendEmailOptions {
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  attachment?: EmailAttachment;
}
