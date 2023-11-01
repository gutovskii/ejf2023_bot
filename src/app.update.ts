import { InjectModel } from '@nestjs/mongoose';
import Bottleneck from 'bottleneck';
import { Model } from 'mongoose';
import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import * as rateLimit from 'telegraf-ratelimit';
import { telegrafThrottler } from 'telegraf-throttler';
import { MainSceneContext } from './common/types';
import { MAIN_SCENE } from './main/main.scene';
import { REGISTER_WIZARD } from './register/register.wizard';
import { User } from './register/user.schema';

@Update()
export class AppUpdate {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectBot()
    private readonly bot: Telegraf<Context>,
  ) {}

  @Start()
  async start(@Ctx() ctx: MainSceneContext) {
    await ctx.reply('Привіт, друже!', Markup.removeKeyboard());
    this.bot.catch(async (err, ctx) => {
      await ctx.reply(
        'Щось пішло не так 😦 спробуй ще раз або перезапусти бота /start',
      );
    });
    this.bot.use(
      telegrafThrottler({
        in: {
          highWater: 10000,
          maxConcurrent: 1,
          minTime: 200,
          strategy: Bottleneck.strategy.BLOCK,
        },
        inKey: 'chat',
        inThrottlerError: (ctx) => {
          return ctx.reply('Забагато пишеш, зачілься нє?');
        },
      }),
    );
    this.bot.use(
      rateLimit({
        window: 500,
        limit: 1,
        onLimitExceeded: async (ctx) => {
          await ctx.reply('Забагато пишеш, зачілься нє?');
        },
      }),
    );
    const user = await this.userModel.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.scene.enter(REGISTER_WIZARD);
      return;
    } else {
      ctx.session.user = user;
      await ctx.scene.enter(MAIN_SCENE);
    }
  }
}
