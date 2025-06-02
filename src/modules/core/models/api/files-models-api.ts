export interface FileUploadRequest {
  files: File[];
  route: string;
  table: string;
  id: number;
}

export interface OneDriveFileApi {
  id_onedrive: string;
  filename: string;
}
