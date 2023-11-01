import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { MainSceneContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';
import { Markup } from 'telegraf';
import { BAN_USER_WIZARD } from './wizards/ban-user.wizard';
import { BROADCAST_MESSAGE_WIZARD } from './wizards/broadcast-message.wizard';
import { CHANGE_ROLE_WIZARD } from './wizards/change-role.wizard';
import { FIND_USER_WIZARD } from './wizards/find-user.wizard';
import { MESSAGE_TO_USER_WIZARD } from './wizards/message-to-user.wizard';
import { SHOW_BANNED_WIZARD } from './wizards/show-banned.wizard';
import { UNBAN_USER_WIZARD } from './wizards/unban-user.wizard';

export enum AdminAction {
  FIND_USER = 'Віднайти челіка 🔍',
  CHANGE_ROLE = 'Змінити роль 🥋',
  MESSAGE_TO_USER = 'Написати челіку ✏',
  BROADCAST_MESSAGE = 'Написати всім 👻',
  BAN_USER = 'Забанити челіка 🎃',
  UNBAN_USER = 'Розбанити челіка 🙏',
  SHOW_BANNED = 'Статистика забанених 👥',
}

export const ADMIN_SCENE = 'ADMIN_SCENE';

@Scene(ADMIN_SCENE)
export class AdminScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(
      'Оберіть дію',
      Markup.keyboard(
        [
          ...Object.values(AdminAction).map((actionName) =>
            Markup.button.text(actionName),
          ),
          Markup.button.text('Назад'),
        ],
        { columns: 2 },
      ).resize(true),
    );
  }

  @Hears(AdminAction.FIND_USER)
  findUser(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(FIND_USER_WIZARD);
  }

  @Hears(AdminAction.CHANGE_ROLE)
  changeRole(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(CHANGE_ROLE_WIZARD);
  }

  @Hears(AdminAction.MESSAGE_TO_USER)
  messageToUser(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(MESSAGE_TO_USER_WIZARD);
  }

  @Hears(AdminAction.BROADCAST_MESSAGE)
  broadcaseMessage(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(BROADCAST_MESSAGE_WIZARD);
  }

  @Hears(AdminAction.BAN_USER)
  banUser(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(BAN_USER_WIZARD);
  }

  @Hears(AdminAction.UNBAN_USER)
  unbanUser(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(UNBAN_USER_WIZARD);
  }

  @Hears(AdminAction.SHOW_BANNED)
  showBanned(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(SHOW_BANNED_WIZARD);
  }

  @Hears('Назад')
  goBack(@Ctx() ctx: MainSceneContext) {
    return ctx.scene.enter(MAIN_SCENE);
  }
}
