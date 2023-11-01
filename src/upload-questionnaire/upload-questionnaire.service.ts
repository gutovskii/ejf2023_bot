import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AwsService } from 'src/aws/aws.service';
import { Questionnaire } from './questionnaire.schema';
import { questionnaireToText } from './upload-questionnaire.utils';

@Injectable()
export class UploadQuestionnaireService {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
    private readonly awsService: AwsService,
  ) {}

  async setupQuestionnaireReply(
    filterQuery: FilterQuery<Questionnaire>,
  ): Promise<{ source: Buffer; filename: string; caption: string }> {
    const questionnaire = await this.questionnaireModel
      .findOne(filterQuery)
      .populate('user', 'username');
    const fileOutput = await this.awsService.getObject(questionnaire.key);
    const fileBuffer = Buffer.from(
      await fileOutput.Body.transformToByteArray(),
    );
    return {
      source: fileBuffer,
      filename: `${questionnaire.fileName}${questionnaire.extname}`,
      caption: questionnaireToText(questionnaire),
    };
  }
}
