import { EmailNotificationService } from '../core/notifications/services/email-notification.service';
import { BrevoEmailService } from '../infrastructure/email/services/brevo-email.service';
import { GraphEmailService } from '../infrastructure/email/services/graph-email.service';
import { ExcelGeneratorServices } from '../domain/excel/services/excel-generator.service';
import { PDFGeneratorService } from '../domain/contracts/services/pdf-generator.service';

export class ServiceContainer {
  private static instance: ServiceContainer;
  public readonly emailService: BrevoEmailService;
  public readonly excelService: ExcelGeneratorServices;
  public readonly pdfService: PDFGeneratorService;
  public readonly emailNotificationService: EmailNotificationService;

  private constructor() {
    this.emailService = new BrevoEmailService();
    this.excelService = new ExcelGeneratorServices();
    this.pdfService = new PDFGeneratorService();
    this.emailNotificationService = new EmailNotificationService();
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }
}
