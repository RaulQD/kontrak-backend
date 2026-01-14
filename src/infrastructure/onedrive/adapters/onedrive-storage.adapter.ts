import { Client, ResponseType } from '@microsoft/microsoft-graph-client';
import { OneDriveProvider } from '../provider/onedrive.provider';
import {
  OneDriveDriveItem,
  OneDriveListResponse,
  OneDriveUploadResponse,
} from '../types/onedrive-api.types';
import { FileMetadata, FileStorageService } from '../storage';
import { logger } from '../../../shared/utils/logger';

export class OneDriveStorageAdapter implements FileStorageService {
  private client: Client;
  private userEmail: string;

  constructor() {
    this.client = OneDriveProvider.getClient();
    this.userEmail = process.env.ONEDRIVE_USER_EMAIL || '';

    if (!this.userEmail) {
      throw new Error('ONEDRIVE_USER_EMAIL no está configurado');
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
          createdByEmail: item.createdBy?.user?.email,
          createdByName: item.createdBy?.user?.displayName,
        }),
      );
      files.forEach((f) => {
        logger.info(
          `Archivo: ${f.name}, Subido por: ${f.createdByEmail || 'N/A'}`,
        );
      });

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
  async downloadFile(
    fileId: string,
  ): Promise<{ buffer: Buffer; error?: string }> {
    try {
      const response = await this.client
        .api(`/users/${this.userEmail}/drive/items/${fileId}/content`)
        .responseType(ResponseType.ARRAYBUFFER)
        .get();
      const buffer = Buffer.from(response);
      return { buffer };
    } catch (error) {
      logger.error({ error }, 'Error al descargar archivo de OneDrive');
      return {
        buffer: Buffer.alloc(0),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  async uploadFile(
    file: Buffer,
    folderPath: string,
    filename: string,
  ): Promise<string> {
    try {
      // Usar conflictBehavior=replace para sobrescribir si existe
      const response: OneDriveUploadResponse = await this.client
        .api(
          `/users/${this.userEmail}/drive/root:/${folderPath}/${filename}:/content?@microsoft.graph.conflictBehavior=replace`,
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
      // Si el archivo ya no existe (404), ignorar el error
      if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        error.statusCode === 404
      ) {
        logger.warn(`Archivo ya eliminado o no encontrado: ${fileId}`);
        return; // No lanzar error, solo continuar
      }
      logger.error({ error }, 'Error al eliminar archivo de OneDrive');
      throw error;
    }
  }
}
