import { S3 } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';

@Module({
  providers: [
    AwsService,
    {
      provide: S3,
      useValue: new S3({}),
    },
  ],
  exports: [AwsService],
})
export class AwsModule {}
