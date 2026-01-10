import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { logger } from '../../utils/logger';

export class OneDriveProvider {
  private static client: Client | null = null;

  public static getClient(): Client {
    if (this.client) {
      logger.info('Reutilizando cliente Microsoft Graph');
      return this.client;
    }
    logger.info('Inicializando cliente');
    const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } =
      process.env;

    if (!AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
      throw new Error('❌ Faltan variables de entorno de Azure');
    }
    try {
      const credential = new ClientSecretCredential(
        AZURE_TENANT_ID,
        AZURE_CLIENT_ID,
        AZURE_CLIENT_SECRET,
      );

      const authProvider = new TokenCredentialAuthenticationProvider(
        credential,
        {
          scopes: ['https://graph.microsoft.com/.default'],
        },
      );

      this.client = Client.initWithMiddleware({
        debugLogging: process.env.NODE_ENV === 'development',
        authProvider,
      });

      logger.info('✅ Cliente Microsoft Graph inicializado');
      return this.client;
    } catch (error) {
      logger.error({ error }, '❌ Error inicializando cliente Graph');
      throw error;
    }
  }
}
