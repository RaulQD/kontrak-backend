import { FileMetadata } from './file-metadata.interface';

export interface FileStorageService {
  getFiles(folderPath: string): Promise<FileMetadata[]>;
  downloadFile(fileId: string): Promise<Buffer>;
  uploadFile(
    file: Buffer,
    folderPath: string,
    filename: string,
  ): Promise<string>;
  deleteFile(fileId: string): Promise<void>;
}
