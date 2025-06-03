import type { OneDriveFile } from '../models';
import type { OneDriveFileApi } from '../models/api';

export class FilesAdapter {
  static toOneDriveFile(file: OneDriveFileApi): OneDriveFile {
    return {
      idOnedrive: file.id_onedrive,
      filename: file.filename,
    };
  }
}
