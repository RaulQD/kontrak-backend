import { BrevoEmailService } from '../../../infrastructure/email/services/brevo-email.service';
import { getSuccessTemplate, getValidationErrorTemplate } from '../templates';
import {
  FileErrorTemplateData,
  getFileErrorTemplate,
} from '../templates/validation-file.template';
import {
  SuccessTemplateData,
  ValidationErrorTemplateData,
} from '../types/notification.types';

export class EmailNotificationService {
  private emailService: BrevoEmailService;
  constructor() {
    this.emailService = new BrevoEmailService();
  }
  async sendSuccessNotificacion(data: SuccessTemplateData) {
    try {
      const temnplate = getSuccessTemplate(data);
      await this.emailService.sendEmailWithAttachment({
        from: 'raul.g.quispe@gmail.com',
        to: [data.createdByEmail],
        subject: 'Carga Completada',
        body: temnplate,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async sendValidationErrorNotification(data: ValidationErrorTemplateData) {
    try {
      const temnplate = getValidationErrorTemplate(data);
      await this.emailService.sendEmailWithAttachment({
        from: 'raul.g.quispe@gmail.com',
        to: [data.createdByEmail],
        subject: 'Carga Fallida',
        body: temnplate,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async sendValidationFileNotification(data: FileErrorTemplateData) {
    try {
      const temnplate = getFileErrorTemplate(data);
      await this.emailService.sendEmailWithAttachment({
        from: 'raul.g.quispe@gmail.com',
        to: [data.createdByEmail],
        subject: 'Carga Fallida',
        body: temnplate,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
