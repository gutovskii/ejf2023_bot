import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { MainSceneContext } from 'src/common/types';
import { Markup } from 'telegraf';
import { UPLOAD_QUESTIONNAIRE_SCENE } from '../upload-questionnaire.scene';
import { CHANGE_DESCRIPTION_BIO_WIZARD } from './wizards/change-bio.wizard';
import { CHANGE_DESCRIPTION_FULLNAME_WIZARD } from './wizards/change-fullname.wizard';
import { CHANGE_DESCRIPTION_LEVEL_WIZARD } from './wizards/change-position.wizard';
import { CHANGE_DESCRIPTION_TECHNOLOGIES_WIZARD } from './wizards/change-technologies.wizard';

export const CHANGE_DESCRIPTION_SCENE = 'CHANGE_DESCRIPTION_SCENE';

@Scene(CHANGE_DESCRIPTION_SCENE)
export class ChangeDescriptionScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(
      'Що бажаєш змінити?',
      Markup.keyboard(
        [
          Markup.button.text("Ім'я/Прізвище"),
          Markup.button.text('Рівень'),
          Markup.button.text('Технології'),
          Markup.button.text('Біографія'),
          Markup.button.text('Назад'),
        ],
        { columns: 2 },
      ).resize(true),
    );
  }

  @Hears("Ім'я/Прізвище")
  async changeFullname(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(CHANGE_DESCRIPTION_FULLNAME_WIZARD);
  }

  @Hears('Позиція')
  async changeLevel(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(CHANGE_DESCRIPTION_LEVEL_WIZARD);
  }

  @Hears('Технології')
  async changeTechnologies(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(CHANGE_DESCRIPTION_TECHNOLOGIES_WIZARD);
  }

  @Hears('Біографія')
  async changeBio(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(CHANGE_DESCRIPTION_BIO_WIZARD);
  }

  @Hears('Назад')
  async goBack(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
  }
}
