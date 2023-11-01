import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { PaginationMessage } from 'src/common/pagination';
import { MainSceneContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';
import { Questionnaire } from 'src/upload-questionnaire/questionnaire.schema';
import { UploadQuestionnaireService } from 'src/upload-questionnaire/upload-questionnaire.service';
import { questionnaireToText } from 'src/upload-questionnaire/upload-questionnaire.utils';
import { Markup, Telegraf, deunionize } from 'telegraf';
import { questionnaireSearchFilterQuery } from './view-questionnaires.utils';

export interface ViewQuestionnairesSceneContext extends MainSceneContext {
  scene: {
    state: {
      isSearching: boolean;
    };
  } & MainSceneContext['scene'];
}

export const VIEW_QUESTIONNAIRES_SCENE = 'VIEW_QUESTIONNAIRES_SCENE';

@Scene(VIEW_QUESTIONNAIRES_SCENE)
export class ViewQuestionnairesScene {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<ViewQuestionnairesSceneContext>,
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
    private readonly uploadQuestionnaireService: UploadQuestionnaireService,
  ) {}

  @SceneEnter()
  async enterScene(@Ctx() ctx: ViewQuestionnairesSceneContext) {
    await this.replyWithPagination(ctx);
  }

  private async replyWithPagination(
    ctx: ViewQuestionnairesSceneContext,
    search?: string,
  ) {
    const pagination = await PaginationMessage.build({
      bot: this.bot,
      itemPerPage: 1,
      model: this.questionnaireModel,
      format: (cv) => questionnaireToText(cv),
      modelFilter: questionnaireSearchFilterQuery(search),
      isSelectBtns: true,
      selectItem: async (model, ctx) => {
        const { source, filename, caption } =
          await this.uploadQuestionnaireService.setupQuestionnaireReply({
            key: model.key,
          });
        await ctx.replyWithDocument({ source, filename }, { caption });
      },
    });

    const { text, keyboard } = await pagination.setupMessage();

    await ctx.reply(
      '✨🔍',
      Markup.keyboard([
        Markup.button.text('Шукати анкети 🔍'),
        Markup.button.text('Назад ↩'),
      ]).resize(true),
    );

    await ctx.reply(text, {
      ...keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  @Hears('Шукати анкети 🔍')
  async findQuestionnaires(@Ctx() ctx: ViewQuestionnairesSceneContext) {
    await ctx.reply('Уведи пошукове слово 🔍', Markup.removeKeyboard());
    ctx.scene.state.isSearching = true;
  }

  @Hears('Назад ↩')
  async goBack(@Ctx() ctx: ViewQuestionnairesSceneContext) {
    ctx.scene.enter(MAIN_SCENE);
  }

  @On('text')
  async onText(@Ctx() ctx: ViewQuestionnairesSceneContext) {
    if (ctx.scene.state.isSearching) {
      await this.replyWithPagination(ctx, deunionize(ctx.message).text);
      ctx.scene.state.isSearching = false;
    }
  }
}
