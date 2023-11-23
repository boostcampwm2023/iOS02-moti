import { FileStore, StoreOptions } from './file-store';
import { Injectable } from '@nestjs/common';
import { File, UploadFile } from './index';
import { UuidHolder } from '../uuid-holder';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import * as path from 'path/posix';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;
import { FailFileTaskException } from './fail-file-task.exception';

@Injectable()
export class ObjectStorageFileStore extends FileStore {
  private readonly objectStorageClient: S3;
  private readonly defaultBucketName: string;

  constructor(uuidHolder: UuidHolder, configService: ConfigService) {
    super(uuidHolder);
    console.log(1);
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: configService.get('NCP_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('NCP_SECRET_ACCESS_KEY'),
    });
    console.log(2);
    this.objectStorageClient = new AWS.S3({
      endpoint: configService.get('NCP_ENDPOINT'),
      region: configService.get('NCP_REGION'),
    });
    console.log(3);
    this.defaultBucketName = configService.get('NCP_BUCKET_NAME');
  }

  async delete(
    filepath: string,
    storedOptions: StoreOptions = {},
  ): Promise<void> {
    try {
      await this.objectStorageClient
        .deleteObject({
          Bucket: this.resolveBucketName(storedOptions),
          Key: this.getFullPath(filepath, storedOptions),
        })
        .promise();
    } catch (e) {
      throw new FailFileTaskException();
    }
  }

  async upload(
    file: File,
    storedOptions: StoreOptions = {},
  ): Promise<UploadFile> {
    const originalFilename = file.originalname;
    const storeFileName = this.createStoreFileName(originalFilename);
    const fullPath = this.getFullPath(storeFileName, storedOptions);

    try {
      const sendData: SendData = await this.objectStorageClient
        .upload({
          Bucket: this.resolveBucketName(storedOptions),
          Key: fullPath,
          ACL: 'public-read',
          Body: file.buffer,
        })
        .promise();

      return {
        uploadFileName: storeFileName,
        originalFileName: originalFilename,
        uploadFullPath: sendData.Location,
      };
    } catch (e) {
      throw new FailFileTaskException();
    }
  }

  private resolveBucketName(storedOptions: StoreOptions) {
    return storedOptions?.prefix || this.defaultBucketName;
  }

  private getFullPath(filename: string, storeOptions: StoreOptions) {
    return path.join(storeOptions?.basePath || '', filename);
  }
}
