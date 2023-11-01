import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { MainSceneContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';
import { CHANGE_CV_SCENE } from './change-cv/change-cv.scene';
import { CHANGE_DESCRIPTION_SCENE } from './change-description/change-description.scene';
import { Questionnaire } from './questionnaire.schema';
import { uploadQuestionnaireReply } from './upload-questionnaire.utils';
import { DELETE_QUESTIONNAIRE_WIZARD } from './wizards/delete-questionnaire.wizard';
import { FILL_QUESTIONNAIRE_WIZARD } from './wizards/fill-questionnaire.wizard';
import { VIEW_QUESTIONNAIRE_WIZARD } from './wizards/view-questionnaire.wizard';

export enum UploadQuestionnaireAction {
  VIEW_QUESTIONNAIRE = 'Моя анкета 😎',
  FILL_QUESTIONNAIRE = 'Заповнити анкету 📮',
  FILL_AGAIN = 'Заповнити наново 🔁',
  REMOVE_QUESTIONNAIRE = 'Видалити ❌',
  CHANGE_DESCRIPTION = 'Змінити опис ✏',
  CHANGE_CV = 'Змінити CV 📝',
}

export const UPLOAD_QUESTIONNAIRE_SCENE = 'UPLOAD_QUESTIONNAIRE_SCENE';

@Scene(UPLOAD_QUESTIONNAIRE_SCENE)
export class UploadQuestionnaireScene {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
  ) {}

  @SceneEnter()
  async enterScene(@Ctx() ctx: MainSceneContext) {
    const questionnaire = await this.questionnaireModel.findOne({
      user: ctx.session.user,
    });
    await uploadQuestionnaireReply(ctx, !!questionnaire);
  }

  @Hears(UploadQuestionnaireAction.VIEW_QUESTIONNAIRE)
  async viewQuestionnaire(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(VIEW_QUESTIONNAIRE_WIZARD);
  }

  @Hears(UploadQuestionnaireAction.FILL_QUESTIONNAIRE)
  async fillQuestionnaire(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(FILL_QUESTIONNAIRE_WIZARD);
  }

  @Hears(UploadQuestionnaireAction.FILL_AGAIN)
  async fillQuestionnaireAgain(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(FILL_QUESTIONNAIRE_WIZARD);
  }

  @Hears(UploadQuestionnaireAction.CHANGE_DESCRIPTION)
  async changeDescription(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(CHANGE_DESCRIPTION_SCENE);
  }

  @Hears(UploadQuestionnaireAction.CHANGE_CV)
  async changeCV(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(CHANGE_CV_SCENE);
  }

  @Hears(UploadQuestionnaireAction.REMOVE_QUESTIONNAIRE)
  async removeCV(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(DELETE_QUESTIONNAIRE_WIZARD);
  }

  @Hears('Назад ↩')
  async goBack(@Ctx() ctx: MainSceneContext) {
    ctx.scene.enter(MAIN_SCENE);
  }
}
