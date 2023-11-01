import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { MainSceneContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';
import { Markup } from 'telegraf';
import { timetableText } from './timetable.config';

export const TIMETABLE_SCENE = 'TIMETABLE_SCENE';

@Scene(TIMETABLE_SCENE)
export class TimetableScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(
      'Обери день',
      Markup.keyboard(
        [
          Markup.button.text('День 1️⃣'),
          Markup.button.text('День 2️⃣'),
          Markup.button.text('Назад'),
        ],
        { columns: 2 },
      ).resize(true),
    );
  }

  @Hears('День 1️⃣')
  async firstDay(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(timetableText.firstDay, { parse_mode: 'HTML' });
  }

  @Hears('День 2️⃣')
  async secondDay(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(timetableText.secondDay, { parse_mode: 'HTML' });
  }

  @Hears('Назад')
  goBack(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(MAIN_SCENE);
  }
}
