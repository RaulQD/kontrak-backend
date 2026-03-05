import { Readable } from 'stream';
import { FileMetadata } from './file-metadata.interface';

export interface FileStorageService {
  getFiles(folderPath: string): Promise<FileMetadata[]>;
  downloadFile(fileId: string): Promise<{ buffer: Buffer; error?: string }>;
  downloadFileByPath(
    filePath: string,
  ): Promise<{ buffer: Buffer; error?: string }>;
  downloadFileAsStream(
    fileId: string,
  ): Promise<{ stream: Readable; error?: string }>;

  uploadFile(
    file: Buffer | Readable,
    folderPath: string,
    filename: string,
  ): Promise<string>;
  deleteFile(fileId: string): Promise<void>;
}
