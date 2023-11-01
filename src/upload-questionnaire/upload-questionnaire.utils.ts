import { MainSceneContext } from 'src/common/types';
import { Markup } from 'telegraf';
import { Questionnaire } from './questionnaire.schema';
import { UploadQuestionnaireAction } from './upload-questionnaire.scene';

export const uploadQuestionnaireReply = async (
  ctx: MainSceneContext,
  isCVInfoExists: boolean,
) => {
  if (isCVInfoExists) {
    await ctx.reply(
      'Обери дію',
      Markup.keyboard(
        [
          Markup.button.text(UploadQuestionnaireAction.VIEW_QUESTIONNAIRE),
          Markup.button.text(UploadQuestionnaireAction.FILL_AGAIN),
          Markup.button.text(UploadQuestionnaireAction.CHANGE_DESCRIPTION),
          Markup.button.text(UploadQuestionnaireAction.CHANGE_CV),
          Markup.button.text(UploadQuestionnaireAction.REMOVE_QUESTIONNAIRE),
          Markup.button.text('Назад ↩'),
        ],
        { columns: 2 },
      ).resize(true),
    );
  } else {
    await ctx.reply(
      'Значить не маєш заповненої анкети? Натискай на кнопку для заповнення та й погнали 😼',
      Markup.keyboard([
        Markup.button.text(UploadQuestionnaireAction.FILL_QUESTIONNAIRE),
        Markup.button.text('Назад ↩'),
      ]).resize(true),
    );
    await ctx.reply(
      'Спеціально неправильно заповнена анкета приводить до попередження або бану, тому будь обачливий 🙂',
    );
  }
};

// TODO: show username if exists
export const questionnaireToText = (questionnaire: Questionnaire) => {
  const username = questionnaire.user?.username;
  return `${username ? `@${username}\n` : ''}👤 ${questionnaire.fullName}\n 🚩${
    questionnaire.position
  }\n⚙ ${questionnaire.technologies}\nℹ ${questionnaire.bio}\n\n`;
};
