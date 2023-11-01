import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { MainSceneContext } from 'src/common/types';
import { Markup } from 'telegraf';
import { UPLOAD_QUESTIONNAIRE_SCENE } from '../upload-questionnaire.scene';
import { CHANGE_CV_FILE_WIZARD } from './wizards/change-cv-file.wizard';
import { CHANGE_CV_FILENAME_WIZARD } from './wizards/change-cv-filename.wizard';

export const CHANGE_CV_SCENE = 'CHANGE_CV_SCENE';

@Scene(CHANGE_CV_SCENE)
export class ChangeCVScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(
      'Що саме бажаєш змінити?',
      Markup.keyboard(
        [
          Markup.button.text('Назва файлу'),
          Markup.button.text('Файл'),
          Markup.button.text('Назад'),
        ],
        { columns: 2 },
      ).resize(true),
    );
  }

  @Hears('Назва файлу')
  async changeFileName(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(CHANGE_CV_FILENAME_WIZARD);
  }

  @Hears('Файл')
  async changeFile(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(CHANGE_CV_FILE_WIZARD);
  }

  @Hears('Назад')
  async goBack(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
  }
}
