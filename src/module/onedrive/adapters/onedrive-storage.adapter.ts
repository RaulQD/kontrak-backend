import { Client, ResponseType } from '@microsoft/microsoft-graph-client';
import { OneDriveProvider } from '../../provider/onedrive.provider';
import { logger } from '../../../utils/logger';
import {
  OneDriveDriveItem,
  OneDriveListResponse,
  OneDriveUploadResponse,
} from '../types/onedrive-api.types';
import { FileMetadata, FileStorageService } from '../storage';

export class OneDriveStorageAdapter implements FileStorageService {
  private client: Client;
  private userEmail: string;

  constructor() {
    this.client = OneDriveProvider.getClient();
    this.userEmail = process.env.ONEDRIVE_USER_EMAIL || '';

    if (!this.userEmail) {
      throw new Error('❌ ONEDRIVE_USER_EMAIL no está configurado');
    }
  }
  async getFiles(folderPath: string): Promise<FileMetadata[]> {
    try {
      const response: OneDriveListResponse = await this.client
        .api(`/users/${this.userEmail}/drive/root:/${folderPath}:/children`)
        .get();
      const files: FileMetadata[] = response.value.map(
        (item: OneDriveDriveItem) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          lastModifiedDateTime: new Date(item.lastModifiedDateTime),
        }),
      );
      return files;
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        error.statusCode === 404
      ) {
        logger.warn(`Carpeta no encontrada: ${folderPath}`);
        return [];
      }
      logger.error(
        { error },
        `Error listando archivos en carpeta: ${folderPath}`,
      );
      throw error;
    }
  }
  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await this.client
        .api(`/users/${this.userEmail}/drive/items/${fileId}/content`)
        .responseType(ResponseType.ARRAYBUFFER)
        .get();
      const buffer = Buffer.from(response);
      return buffer;
    } catch (error) {
      logger.error({ error }, 'Error al descargar archivo de OneDrive');
      throw error;
    }
  }
  async uploadFile(
    file: Buffer,
    folderPath: string,
    filename: string,
  ): Promise<string> {
    try {
      const response: OneDriveUploadResponse = await this.client
        .api(
          `/users/${this.userEmail}/drive/root:/${folderPath}/${filename}:/content`,
        )
        .put(file);
      return response.id;
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        error.statusCode === 404
      ) {
        throw new Error(`La carpeta '${folderPath}' no existe en OneDrive`);
      }
      logger.error({ error }, 'Error al subir archivo a OneDrive');
      throw error;
    }
  }
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.client
        .api(`/users/${this.userEmail}/drive/items/${fileId}`)
        .delete();
    } catch (error) {
      logger.error({ error }, 'Error al eliminar archivo de OneDrive');
      throw error;
    }
  }
}
