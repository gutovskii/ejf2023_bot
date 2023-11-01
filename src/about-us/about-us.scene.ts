import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { MainSceneContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';
import { Markup } from 'telegraf';
import { aboutUsConfig } from './about-us.config';

export const ABOUT_US_SCENE = 'ABOUT_US_SCENE';

@Scene(ABOUT_US_SCENE)
export class AboutUsScene {
  @SceneEnter()
  async enterScene(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(
      'Що саме вас цікавить? 🫠',
      Markup.keyboard(
        [
          Markup.button.text('Що таке ІЯК?'),
          Markup.button.text('Компанії на ІЯКу'),
          Markup.button.text('Хто організатори?'),
          Markup.button.text('Інші проєкти BEST Lviv'),
          Markup.button.text('Назад ↩️'),
        ],
        { columns: 2 },
      ).resize(true),
    );
  }

  @Hears('Що таке ІЯК?')
  async whatIsEJF(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(aboutUsConfig.whatIsEJF);
  }

  @Hears('Компанії на ІЯКу')
  async companiesAtEJF(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(aboutUsConfig.companiesAtEJF);
  }

  @Hears('Хто організатори?')
  async ejfOrganizers(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(aboutUsConfig.whoAreBEST);
  }

  @Hears('Інші проєкти BEST Lviv')
  async otherBESTProjects(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(aboutUsConfig.otherBESTProjects);
  }

  @Hears('Назад ↩️')
  async goBack(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(MAIN_SCENE);
  }
}
