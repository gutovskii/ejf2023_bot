import { Injectable, PipeTransform } from '@nestjs/common';
import { Document } from 'telegraf/typings/core/types/typegram';
import { InvalidAnswerException } from '../exceptions/invalid-answer.exception';
import { MainWizardContext } from '../types';

export interface ValidateDocumentOptions {
  maxSizeInBytes: number;
  extname: string;
}

@Injectable()
export class ValidateDocumentPipe implements PipeTransform {
  constructor(private options: ValidateDocumentOptions) {}

  transform(ctx: MainWizardContext) {
    const document = (ctx.update as any).message.document as Document;
    if (document.file_size > this.options.maxSizeInBytes) {
      throw new InvalidAnswerException('Файл занадто великий, спробуй ще раз');
    }
    if (!document.mime_type.includes(this.options.extname)) {
      throw new InvalidAnswerException(
        'Неправильне розширення, спробуй ще раз',
      );
    }
    return ctx;
  }
}
