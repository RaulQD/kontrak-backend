export interface OneDriveDriveItem {
  id: string;
  name: string;
  size: number;
  lastModifiedDateTime: Date;
  file?: { mimeType: string };
  folder?: { childCount: number };
  createdBy: {
    user: {
      email: string;
      displayName: string;
      id: string;
    };
  };
  lastModifiedBy: {
    user: {
      email: string;
      displayName: string;
      id: string;
    };
  };
}
export interface OneDriveListResponse {
  value: OneDriveDriveItem[];
}
export interface OneDriveUploadResponse {
  id: string;
  name: string;
  size: number;
}
