import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';
import * as path from 'path';
import * as uuid from 'uuid';

export const FIVE_MB = 5_242_880;

@Injectable()
export class AwsService {
  constructor(
    private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {}

  async getObject(key: string) {
    const obj = await this.s3.getObject({
      Key: key,
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
    });
    return obj;
  }

  async updateObjectKey(oldKey: string, fileName: string) {
    const newKey = `${fileName}#${uuid.v4()}${path.extname(oldKey)}`;
    const bucketName = this.configService.get('AWS_PUBLIC_BUCKET_NAME');
    await this.s3.copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${oldKey}`,
      Key: newKey,
    });
    await this.s3.deleteObject({
      Bucket: bucketName,
      Key: oldKey,
    });
    return newKey;
  }

  async updateObject(oldKey: string, stream: IncomingMessage) {
    const fileName = oldKey.split('#')[0];
    const ext = path.extname(oldKey);
    await this.removeObject(oldKey);
    const newKey = await this.uploadFileByStream(fileName, ext, stream);
    return newKey;
  }

  async uploadFileByStream(
    fileName: string,
    ext: string,
    stream: IncomingMessage,
  ) {
    const bufs: Buffer[] = [];
    return new Promise((res, rej) => {
      stream.on('data', (chunk) => bufs.push(chunk));
      stream.on('end', async () => {
        const resBuffer = Buffer.concat(bufs);
        const key = `${fileName}#${uuid.v4()}${ext}`; // Pes_Patron_Senior_Backend_ASM_CV#12aa21-1488-1337-1357.pdf
        await this.s3.putObject({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: resBuffer,
          Key: key,
        });
        res(key);
      });
      stream.on('error', (error) => {
        console.log(error);
        console.log(error.message);
        rej('Щось пішло не так 😦, спробуй ще раз або перезапусти бота /start');
      });
    });
  }

  async removeObject(key: string) {
    await this.s3.deleteObject({
      Key: key,
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
    });
  }
}
