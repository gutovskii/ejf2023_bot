import { Markup } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { MainWizardContext, WizardQuiz } from './types';

export const wizardReply = async (
  ctx: WizardContext,
  quiz: WizardQuiz,
  step: number,
  options?: {
    isSendReply?: boolean;
    isNavBtns?: boolean;
    isRemoveBtns?: boolean;
    goToMenuBtnText?: string;
    goToPrevQuestionBtnText?: string;
  },
) => {
  if (!options) {
    options = {
      isSendReply: true,
      isNavBtns: true,
      goToMenuBtnText: 'Меню',
      goToPrevQuestionBtnText: 'Повернутись',
    };
  }
  if (options.isSendReply) {
    await ctx.reply(quiz[step - 1].reply);
  }
  let btns = [];
  if (quiz[step]?.validAnswers) {
    quiz[step]?.validAnswers.map((answer) => {
      btns.push(Markup.button.text(answer));
    });
  } else if (quiz[step]?.possibleAnswers) {
    quiz[step]?.possibleAnswers.map((answer) => {
      btns.push(Markup.button.text(answer));
    });
  } else if (quiz[step]?.enum) {
    Object.values(quiz[step]?.enum).map((answer: string) => {
      btns.push(Markup.button.text(answer));
    });
  }
  if (options.isNavBtns) {
    if (options?.goToMenuBtnText) {
      btns.push(Markup.button.text(options.goToMenuBtnText));
    } // TODO: if question has allowed answers they appear
    if (options?.goToPrevQuestionBtnText && step !== 1) {
      btns.push(Markup.button.text(options.goToPrevQuestionBtnText));
    }
  }
  if (options.isRemoveBtns) btns = [];
  await ctx.reply(
    quiz[step].question,
    Markup.keyboard(btns, { columns: 2 }).resize(true),
  );
};

export const wizardStepBack = async (
  ctx: MainWizardContext,
  wizardQuiz: WizardQuiz,
  firstStepKeyboard = ['Меню'],
) => {
  if (ctx.wizard.cursor - 1 === 1) {
    await ctx.reply(
      wizardQuiz[ctx.wizard.cursor - 1].question,
      Markup.keyboard(
        firstStepKeyboard.map((btnText) => Markup.button.text(btnText)),
        { columns: 2 },
      ).resize(true),
    );
  } else {
    await ctx.reply(wizardQuiz[ctx.wizard.cursor - 1].question);
  }
  ctx.wizard.back();
};
