import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { PaginationMessage } from 'src/common/pagination';
import { MainSceneContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';
import { Markup, Telegraf, deunionize } from 'telegraf';
import { vacancySearchFilterQuery, vacancyToText } from './vacancies.utils';
import { Vacancy } from './vacancy.schema';

export interface VacanciesSceneContext extends MainSceneContext {
  scene: {
    state: {
      isSearching: boolean;
    };
  } & MainSceneContext['scene'];
}

export const VACANCIES_SCENE = 'VACANCIES_SCENE';

@Scene(VACANCIES_SCENE)
export class VacanciesScene {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<VacanciesSceneContext>,
    @InjectModel(Vacancy.name)
    private readonly vacancyModel: Model<Vacancy>,
  ) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: VacanciesSceneContext) {
    await this.replyWithPagination(ctx);
  }

  private async replyWithPagination(
    ctx: VacanciesSceneContext,
    search?: string,
  ) {
    const pagination = await PaginationMessage.build({
      bot: this.bot,
      model: this.vacancyModel,
      itemPerPage: 3,
      modelFilter: vacancySearchFilterQuery(search),
      format: (v) => vacancyToText(v),
    });

    const { text, keyboard } = await pagination.setupMessage();

    await ctx.reply(
      '✨🔍',
      Markup.keyboard([
        Markup.button.text('Шукати вакансії 🔍'),
        Markup.button.text('Назад ↩'),
      ]).resize(true),
    );
    await ctx.reply(text, {
      ...keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  @Hears('Шукати вакансії 🔍')
  async findVacancies(@Ctx() ctx: VacanciesSceneContext) {
    await ctx.reply('Уведи пошукове слово 🔍', Markup.removeKeyboard());
    ctx.scene.state.isSearching = true;
  }

  @Hears('Назад ↩')
  goBack(@Ctx() ctx: VacanciesSceneContext) {
    return ctx.scene.enter(MAIN_SCENE);
  }

  @On('text')
  async onText(@Ctx() ctx: VacanciesSceneContext) {
    if (ctx.scene.state.isSearching) {
      await this.replyWithPagination(ctx, deunionize(ctx.message).text);
      ctx.scene.state.isSearching = false;
    }
  }
}
