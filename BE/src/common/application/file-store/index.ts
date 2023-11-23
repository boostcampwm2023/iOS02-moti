import { Readable } from 'stream';
export * from './file-store';

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export interface UploadFile {
  uploadFileName: string;
  originalFileName: string;
  uploadFullPath: string;
}
