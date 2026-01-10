export interface StorageError {
  code: string;
  message: string;
  retryable: boolean;
  originalError?: unknown;
}
