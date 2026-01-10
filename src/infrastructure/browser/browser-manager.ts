import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';
import { logger } from '../../utils/logger';

export class BrowserManager {
  private static instance: BrowserManager;
  private browser: Browser | null = null;

  private constructor() {}

  public static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  /**
   * Obtiene el browser (lo crea si no existe o está desconectado)
   */
  public async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.connected) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      logger.info('Browser opened');
    }
    return this.browser;
  }

  /**
   * Cierra el browser si está abierto
   */
  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('Browser cerrado');
    }
  }

  /**
   * Verifica si el browser está activo
   */
  public isConnected(): boolean {
    return this.browser !== null && this.browser.connected;
  }
}
