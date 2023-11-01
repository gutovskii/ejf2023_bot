import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { MainWizardContext } from 'src/common/types';
import { Markup } from 'telegraf';
import { ADMIN_SCENE } from '../admin.scene';
import { BroadcastMessageService } from '../broadcast-message.service';

export interface BroadcastMessageWizardContext extends MainWizardContext {
  wizard: {
    state: {
      message: string;
    } & MainWizardContext['wizard']['state'];
  } & MainWizardContext['wizard'];
}

export const BROADCAST_MESSAGE_WIZARD = 'BROADCAST_MESSAGE_WIZARD';

@Wizard(BROADCAST_MESSAGE_WIZARD)
export class BroadcastMessageWizard {
  constructor(
    private readonly broadcastMessageService: BroadcastMessageService,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: BroadcastMessageWizardContext) {
    await ctx.reply(
      'Напишіть повідомлення ВСІІІМ ✏️🤠😎',
      Markup.keyboard([Markup.button.text('Назад ↩️')], { columns: 2 }).resize(
        true,
      ),
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message('text') message: string,
    @Ctx() ctx: BroadcastMessageWizardContext,
  ) {
    ctx.wizard.state.message = message;
    await ctx.reply(
      'Точно відправити? 👻',
      Markup.keyboard(
        [Markup.button.text('Так ⚡'), Markup.button.text('Ні 🫠')],
        { columns: 2 },
      ).resize(true),
    );
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(
    @Message('text') answer: string,
    @Ctx() ctx: BroadcastMessageWizardContext,
  ) {
    if (answer === 'Так ⚡') {
      this.broadcastMessageService.broadcastMessage(
        ctx.wizard.state.message,
        { isBanned: false },
        ctx,
      );
      await ctx.reply('Відправка стартувала успішно! ✅');
      ctx.scene.enter(ADMIN_SCENE);
      return;
    } else if (answer === 'Ні 🫠') {
      ctx.scene.enter(ADMIN_SCENE);
      return;
    }
  }
}
