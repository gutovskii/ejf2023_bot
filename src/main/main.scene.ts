import { UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { ABOUT_US_SCENE } from 'src/about-us/about-us.scene';
import { ADMIN_SCENE } from 'src/admin/admin.scene';
import { AllowedRoles } from 'src/common/decorators/allowed-roles.decorator';
import { RolesGuard } from 'src/common/guards/allowed-roles.guard';
import { QUEST_CASE_STUDY_SCENE } from 'src/quest-case-study/quest-case-study.scene';
import { Role } from 'src/register/role.enum';
import { User } from 'src/register/user.schema';
import { TIMETABLE_SCENE } from 'src/timetable/timetable.scene';
import { UPLOAD_QUESTIONNAIRE_SCENE } from 'src/upload-questionnaire/upload-questionnaire.scene';
import { VACANCIES_SCENE } from 'src/vacancies/vacancies.scene';
import { VIEW_QUESTIONNAIRES_SCENE } from 'src/view-questionnaires/view-questionnaires.scene';
import { ZSU_FUNDING_SCENE } from 'src/zsu-funding/zsu-funding.scene';
import { Markup } from 'telegraf';
import { Action, printActionButtons } from '../common/accesses';
import { MainSceneContext } from '../common/types';

export const MAIN_SCENE = 'MAIN_SCENE';

@Scene(MAIN_SCENE)
@UseGuards(RolesGuard)
@AllowedRoles(Role.ADMIN)
export class MainScene {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  @SceneEnter()
  @AllowedRoles(Role.USER, Role.PARTNER)
  async sceneEnter(@Ctx() ctx: MainSceneContext) {
    const isBanned = (
      await this.userModel.findOne({ telegramId: ctx.session.user.telegramId })
    ).isBanned;
    if (isBanned) {
      await ctx.reply(
        'Упс, а тобі, виявляється, прилетів бан 🍌',
        Markup.removeKeyboard(),
      );
      return;
    }
    await ctx.reply('Тицяй кнопки', printActionButtons(ctx.session.user.role));
  }

  @Hears(Action.VIEW_TIMETABLE)
  @AllowedRoles(Role.USER, Role.PARTNER)
  timetable(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(TIMETABLE_SCENE);
  }

  @Hears(Action.VIEW_VACANCIES)
  @AllowedRoles(Role.USER, Role.PARTNER)
  vacancies(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(VACANCIES_SCENE);
  }

  @Hears(Action.QUEST_CASE_STUDY)
  @AllowedRoles(Role.PARTNER)
  questCaseStudy(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(QUEST_CASE_STUDY_SCENE);
  }

  @Hears(Action.UPLOAD_QUESTIONNAIRE)
  @AllowedRoles(Role.USER)
  async uploadQuestionnaire(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
  }

  @Hears(Action.VIEW_QUESTIONNAIRES)
  @AllowedRoles(Role.PARTNER)
  async viewQuestionnaires(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(VIEW_QUESTIONNAIRES_SCENE);
  }

  @Hears(Action.ZSU_FUNDING)
  @AllowedRoles(Role.USER, Role.PARTNER)
  async ZSUFunding(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(ZSU_FUNDING_SCENE);
  }

  @Hears(Action.ABOUT_US)
  @AllowedRoles(Role.USER, Role.PARTNER)
  async aboutUs(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(ABOUT_US_SCENE);
  }

  @Hears(Action.ENTER_ADMIN_PANEL)
  async adminPanel(@Ctx() ctx: MainSceneContext) {
    await ctx.reply('👑 Вітаю, пане Адміне 👑');
    return ctx.scene.enter(ADMIN_SCENE);
  }
}
