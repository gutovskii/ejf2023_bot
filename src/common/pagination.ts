import { FilterQuery, Model } from 'mongoose';
import { Markup, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { MainContext } from './types';

export enum PaginationMessageCallback {
  PREV = 'prev',
  NEXT = 'next',
  GO_BACK = 'go_back',
  CURRENT_PAGE = 'current_page',
}

export interface MessageSetup {
  text: string;
  keyboard: Markup.Markup<InlineKeyboardMarkup>;
}

export interface PaginationMessageBuildOptions<TModel> {
  bot: Telegraf<MainContext>;
  model: Model<TModel>;
  itemPerPage: number;
  modelFilter: FilterQuery<TModel>;
  format: (model: TModel, index?: number) => string;
  isSelectBtns?: boolean;
  selectItem?: (model: TModel, ctx: MainContext) => Promise<unknown>;
}

interface PaginationMessageConstructorOptions<TModel>
  extends PaginationMessageBuildOptions<TModel> {
  modelsCount: number;
  pagesCount: number;
}

export class PaginationMessage<TModel> {
  private currentPage = 1;
  private seed = new Date().getTime();
  private currentItems: TModel[] = [];
  private constructor(
    private options: PaginationMessageConstructorOptions<TModel>,
  ) {
    for (let i = 0; i < this.options.itemPerPage; i++) {
      const actionName = `${this.seed}selectItem${i}`;
      this.options.bot.action(actionName, async (ctx) => {
        await this.options.selectItem(this.currentItems[i], ctx);
        await ctx.answerCbQuery();
      });
    }
    options.bot.action(
      this.seed + PaginationMessageCallback.PREV,
      async (ctx) => {
        await this.prev(ctx);
      },
    );
    options.bot.action(
      this.seed + PaginationMessageCallback.NEXT,
      async (ctx) => {
        await this.next(ctx);
      },
    );
    options.bot.action(PaginationMessageCallback.CURRENT_PAGE, async (ctx) =>
      ctx.answerCbQuery(),
    );
  }

  static async build<TModel>(
    options: PaginationMessageBuildOptions<TModel>,
  ): Promise<PaginationMessage<TModel>> {
    const modelsCount = await options.model.count(options.modelFilter);
    const pagesCount = Math.round(modelsCount / options.itemPerPage);
    return new PaginationMessage({
      ...options,
      modelsCount,
      pagesCount,
    });
  }

  public async setupMessage(): Promise<MessageSetup> {
    // text
    const models = await this.options.model
      .find(this.options.modelFilter)
      .skip((this.currentPage - 1) * this.options.itemPerPage)
      .limit(this.options.itemPerPage);
    this.currentItems = models;
    const text = models.map((m, i) => this.options.format(m, i)).join('');
    if (!text.length) {
      return {
        text: 'Нічого не знайдено 😶',
        keyboard: Markup.inlineKeyboard([]),
      };
    }

    // btns
    const inlineBtns = [];
    if (this.options.pagesCount <= 1 && !this.options.isSelectBtns) {
      return { text, keyboard: Markup.inlineKeyboard([]) };
    }
    if (this.options.isSelectBtns) {
      const selectBtnsRow = [];
      for (
        let i = 0;
        i <
        (this.options.itemPerPage === this.currentItems.length
          ? this.options.itemPerPage
          : this.currentItems.length);
        i++
      ) {
        const actionName = `${this.seed}selectItem${i}`;
        selectBtnsRow.push(
          Markup.button.callback((i + 1).toString(), actionName),
        );
      }
      inlineBtns.push(selectBtnsRow);
      if (this.options.pagesCount <= 1)
        return { text, keyboard: Markup.inlineKeyboard(inlineBtns) };
    }
    inlineBtns.push([
      Markup.button.callback('<', this.seed + PaginationMessageCallback.PREV),
      Markup.button.callback(
        `${this.currentPage}/${this.options.pagesCount}`,
        PaginationMessageCallback.CURRENT_PAGE,
      ),
      Markup.button.callback('>', this.seed + PaginationMessageCallback.NEXT),
    ]);
    return { text, keyboard: Markup.inlineKeyboard(inlineBtns) };
  }

  public async prev(ctx: MainContext): Promise<void> {
    if (this.currentPage <= 1) {
      await ctx.answerCbQuery('Це перша сторінка');
    } else {
      this.currentPage--;
      const { text, keyboard } = await this.setupMessage();
      await ctx.answerCbQuery();
      await ctx.editMessageText(text, {
        ...keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    }
  }

  public async next(ctx: MainContext): Promise<void> {
    if (this.currentPage >= this.options.pagesCount) {
      await ctx.answerCbQuery('Це остання сторінка');
    } else {
      this.currentPage++;
      const { text, keyboard } = await this.setupMessage();
      await ctx.answerCbQuery();
      await ctx.editMessageText(text, {
        ...keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    }
  }
}
