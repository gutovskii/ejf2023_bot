import * as Joi from 'joi';
import { MainWizardContext, WizardQuiz } from 'src/common/types';

export interface FillQuestionnaireWizardContext extends MainWizardContext {
  wizard: {
    state: {
      fullName: string;
      position: string;
      technologies: string;
      bio: string;
      fileName: string;
    } & MainWizardContext['wizard']['state'];
  } & MainWizardContext['wizard'];
}

export const fillQuestionnaireWizardQuiz: WizardQuiz = {
  1: {
    question: "Вкажи своє ім'я та прізвище (англійською)",
    reply: 'Файно є',
    errorMessage: 'Правильно впиши 🤓',
    validationSchema: Joi.string().regex(
      /[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,35}/m,
    ),
  },
  2: {
    question:
      'Вкажи посаду, на яку претендуєш (напр. Lead Backend CSS Developer)',
    reply: 'Моцно',
    errorMessage: 'Англійською мовою, будь ласка, та не більше 50 символів 🙃',
    validationSchema: Joi.string().regex(/^[a-zA-Z\,\.\-\—\s0-9]{10,50}$/),
  },
  3: {
    question:
      'Вкажи до 10ти технологій/скілів, якими ти володієш (Пиши через кому)',
    reply: 'Оце ти мозк 🤯',
    errorMessage: 'Ти не те вписав, давай ще раз 🙃',
    validationSchema: Joi.string().regex(
      /^(?:[\w\#\.\-\+\_\/\s]{1,35}\,\s?){0,10}[\w\#\.\-\+\_\/\s]{1,35}$/m,
    ),
  },
  4: {
    question:
      'Напиши короткий опис про себе англійською, на яку посаду подаєшся, від 100 до 200 символів',
    reply: 'Хорош',
    errorMessage: 'Опис має бути від 100 до 200 символів та англійською',
    validationSchema: Joi.string().regex(
      /^[a-zA-Z\,\.\-\—\'\`\"\;\#\@\!\(\)\$\s0-9]{100,200}$/,
    ),
  },
  5: {
    question: 'Вкажи назву файлу (напр. Pes_Patron_Senior_Backend_ASM_CV)',
    reply: 'Непогано!',
    errorMessage: 'Англійською, дозволені символи, _,-, від 15 до 60 символів',
    validationSchema: Joi.string().regex(/^[a-zA-Z0-9\_\-)]{10,60}$/),
  },
  6: {
    question: 'Завантаж файл. Це має бути .pdf не більше 5мб 🙂',
    reply: 'Супер! А тепер очікуй свого рекрутера 😊',
  },
};
