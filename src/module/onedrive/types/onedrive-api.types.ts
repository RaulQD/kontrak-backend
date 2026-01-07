export interface OneDriveDriveItem {
  id: string;
  name: string;
  size: number;
  lastModifiedDateTime: Date;
  file?: { mimeType: string };
  folder?: { childCount: number };
}
export interface OneDriveListResponse {
  value: OneDriveDriveItem[];
}
export interface OneDriveUploadResponse {
  id: string;
  name: string;
  size: number;
}
