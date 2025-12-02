export interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
}

export enum MergeStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
