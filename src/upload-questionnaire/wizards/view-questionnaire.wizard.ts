import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { MainWizardContext } from 'src/common/types';
import { Markup } from 'telegraf';
import { UPLOAD_QUESTIONNAIRE_SCENE } from '../upload-questionnaire.scene';
import { UploadQuestionnaireService } from '../upload-questionnaire.service';

export const VIEW_QUESTIONNAIRE_WIZARD = 'VIEW_QUESTIONNAIRE_WIZARD';

@Wizard(VIEW_QUESTIONNAIRE_WIZARD)
export class ViewQuestionnaireWizard {
  constructor(
    private readonly uploadQuestionnaireService: UploadQuestionnaireService,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: MainWizardContext) {
    await ctx.reply('💭', Markup.removeKeyboard());
    const { source, filename, caption } =
      await this.uploadQuestionnaireService.setupQuestionnaireReply({
        user: ctx.session.user,
      });
    await ctx.replyWithDocument({ source, filename }, { caption });
    ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
  }
}
