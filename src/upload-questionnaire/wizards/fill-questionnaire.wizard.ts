import { HttpService } from '@nestjs/axios';
import { UseFilters, UsePipes } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IncomingMessage } from 'http';
import { Model } from 'mongoose';
import { Ctx, Hears, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { firstValueFrom } from 'rxjs';
import { AwsService, FIVE_MB } from 'src/aws/aws.service';
import { InvalidAnswerFilter } from 'src/common/filters/invalid-answer.filter';
import { ValidateAnswerPipe } from 'src/common/pipes/validate-answer.pipe';
import { ValidateDocumentPipe } from 'src/common/pipes/validate-document.pipe';
import { wizardReply, wizardStepBack } from 'src/common/utils';
import { Markup } from 'telegraf';
import { Document } from 'telegraf/typings/core/types/typegram';
import {
  FillQuestionnaireWizardContext,
  fillQuestionnaireWizardQuiz,
} from '../configs/fill-questionnaire.config';
import { Questionnaire } from '../questionnaire.schema';
import { UPLOAD_QUESTIONNAIRE_SCENE } from '../upload-questionnaire.scene';

export const FILL_QUESTIONNAIRE_WIZARD = 'FILL_QUESTIONNAIRE_WIZARD';

@Wizard(FILL_QUESTIONNAIRE_WIZARD)
@UseFilters(InvalidAnswerFilter)
export class FillQuestionnaireWizard {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
    private readonly awsService: AwsService,
    private readonly httpService: HttpService,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: FillQuestionnaireWizardContext) {
    await ctx.reply(
      fillQuestionnaireWizardQuiz[1].question,
      Markup.keyboard([Markup.button.text('Меню')]).resize(true),
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: fillQuestionnaireWizardQuiz[1].errorMessage,
        validationSchema: fillQuestionnaireWizardQuiz[1].validationSchema,
      }),
    )
    fullName: string,
    @Ctx() ctx: FillQuestionnaireWizardContext,
  ) {
    ctx.wizard.state.fullName = fullName;
    await wizardReply(ctx, fillQuestionnaireWizardQuiz, 2);
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: fillQuestionnaireWizardQuiz[2].errorMessage,
        validationSchema: fillQuestionnaireWizardQuiz[2].validationSchema,
      }),
    )
    position: string,
    @Ctx() ctx: FillQuestionnaireWizardContext,
  ) {
    ctx.wizard.state.position = position;
    await wizardReply(ctx, fillQuestionnaireWizardQuiz, 3);
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: fillQuestionnaireWizardQuiz[3].errorMessage,
        validationSchema: fillQuestionnaireWizardQuiz[3].validationSchema,
      }),
    )
    technologies: string,
    @Ctx() ctx: FillQuestionnaireWizardContext,
  ) {
    ctx.wizard.state.technologies = technologies;
    await wizardReply(ctx, fillQuestionnaireWizardQuiz, 4);
    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: fillQuestionnaireWizardQuiz[4].errorMessage,
        validationSchema: fillQuestionnaireWizardQuiz[4].validationSchema,
      }),
    )
    bio: string,
    @Ctx() ctx: FillQuestionnaireWizardContext,
  ) {
    ctx.wizard.state.bio = bio;
    await wizardReply(ctx, fillQuestionnaireWizardQuiz, 5);
    ctx.wizard.next();
  }

  @WizardStep(6)
  async step6(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: fillQuestionnaireWizardQuiz[5].errorMessage,
        validationSchema: fillQuestionnaireWizardQuiz[5].validationSchema,
      }),
    )
    fileName: string,
    @Ctx() ctx: FillQuestionnaireWizardContext,
  ) {
    ctx.wizard.state.fileName = fileName;
    await wizardReply(ctx, fillQuestionnaireWizardQuiz, 6);
    ctx.wizard.next();
  }

  @WizardStep(7)
  @UsePipes(
    new ValidateDocumentPipe({
      maxSizeInBytes: FIVE_MB,
      extname: 'pdf',
    }),
  )
  async step7(@Ctx() ctx: FillQuestionnaireWizardContext) {
    const document = (ctx.update as any).message.document as Document;
    const fileId = document.file_id;
    await ctx.reply('💭', Markup.removeKeyboard());
    try {
      const fileUrl = await ctx.telegram.getFileLink(fileId);
      const fileStream = (
        await firstValueFrom(
          this.httpService.get(fileUrl.toString(), { responseType: 'stream' }),
        )
      ).data as IncomingMessage;
      const alreadyExistingCV = await this.questionnaireModel.findOne({
        user: ctx.session.user,
      });
      if (alreadyExistingCV) {
        await this.awsService.removeObject(alreadyExistingCV.key);
      }
      const key = await this.awsService.uploadFileByStream(
        ctx.wizard.state.fileName,
        '.pdf',
        fileStream,
      );
      await this.questionnaireModel.findOneAndUpdate(
        {
          user: ctx.session.user,
        },
        {
          fullName: ctx.wizard.state.fullName,
          position: ctx.wizard.state.position,
          technologies: ctx.wizard.state.technologies,
          bio: ctx.wizard.state.bio,
          fileName: ctx.wizard.state.fileName,
          extname: '.pdf',
          key,
          user: ctx.session.user,
        },
        { upsert: true },
      );
      await ctx.reply(fillQuestionnaireWizardQuiz[6].reply);
      await ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
    } catch (error) {
      console.log(error);
      await ctx.reply('Щось пішло не так, 😦 спробуй ще раз');
      await ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
    }
  }

  @Hears('Меню')
  async goToMenu(@Ctx() ctx: FillQuestionnaireWizardContext) {
    ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
  }

  @Hears('Повернутись')
  async goBack(@Ctx() ctx: FillQuestionnaireWizardContext) {
    await wizardStepBack(ctx, fillQuestionnaireWizardQuiz);
  }
}
