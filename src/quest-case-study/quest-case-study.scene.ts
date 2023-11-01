import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { MainSceneContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';

export const QUEST_CASE_STUDY_SCENE = 'QUEST_CASE_STUDY_SCENE';

@Scene(QUEST_CASE_STUDY_SCENE)
export class QuestCaseStudyScene {
  @SceneEnter()
  async enterScene(@Ctx() ctx: MainSceneContext) {
    await ctx.reply('🏗🏗🏗');
    return ctx.scene.enter(MAIN_SCENE);
  }
}
