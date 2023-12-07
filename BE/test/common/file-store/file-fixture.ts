import { File } from '../../../src/common/application/file-store';

export class FileFixture {
  static file(name: string, extension: string): File {
    return {
      originalname: `${name}.${extension}`,
      buffer: Buffer.from(`${name}.${extension}`.repeat(100)),
      encoding: 'utf-8',
      fieldname: 'test',
      mimetype: 'image/jpeg',
      size: 100,
      destination: 'test',
      filename: 'test.jpg',
      path: 'file://test.jpg',
      stream: null,
    };
  }
}
