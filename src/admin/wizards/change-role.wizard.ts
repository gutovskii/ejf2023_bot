import { UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { InvalidAnswerFilter } from 'src/common/filters/invalid-answer.filter';
import { ValidateAnswerPipe } from 'src/common/pipes/validate-answer.pipe';
import { MainWizardContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';
import { Role } from 'src/register/role.enum';
import { User } from 'src/register/user.schema';
import { Markup } from 'telegraf';
import { ADMIN_SCENE } from '../admin.scene';
import { userToText } from '../admin.utils';

export interface ChangeRoleWizardContext extends MainWizardContext {
  wizard: {
    state: {
      user: User;
    } & MainWizardContext['wizard']['state'];
  } & MainWizardContext['wizard'];
}

export const CHANGE_ROLE_WIZARD = 'CHANGE_ROLE_WIZARD';

@Wizard(CHANGE_ROLE_WIZARD)
@UseFilters(InvalidAnswerFilter)
export class ChangeRoleWizard {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: ChangeRoleWizardContext) {
    await ctx.reply(
      'Уведіть телеграм-айді користувача',
      Markup.removeKeyboard(),
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message('text') telegramId: string,
    @Ctx() ctx: ChangeRoleWizardContext,
  ) {
    const user = await this.userModel.findOne({ telegramId });
    if (!user) {
      await ctx.reply('Користувача не знайдено :(');
      return ctx.scene.enter(ADMIN_SCENE);
    }
    ctx.wizard.state.user = user;
    await ctx.reply(userToText(user));
    await ctx.reply(
      'Яку роль хочеш надати?',
      Markup.keyboard(
        [
          Markup.button.text(Role.USER),
          Markup.button.text(Role.PARTNER),
          Markup.button.text(Role.ADMIN),
        ],
        { columns: 2 },
      ).resize(true),
    );
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: 'Оберіть існуючу роль',
        enum: Role,
      }),
    )
    role: Role,
    @Ctx() ctx: ChangeRoleWizardContext,
  ) {
    const updatedUser = ctx.wizard.state.user;
    updatedUser.role = role;
    await this.userModel.updateOne(
      { telegramId: updatedUser.telegramId },
      updatedUser,
    );
    await ctx.reply(`Роль ${role} надана успішно ✅`);
    ctx.scene.enter(MAIN_SCENE);
  }
}
