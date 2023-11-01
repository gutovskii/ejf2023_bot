import * as Joi from 'joi';
import { MainWizardContext, WizardQuiz } from 'src/common/types';

export interface RegisterWizardContext extends MainWizardContext {
  wizard: {
    state: {
      name: string;
      group: string;
      course: string;
      almaMater: string;
    } & MainWizardContext['wizard']['state'];
  } & MainWizardContext['wizard'];
}

export const registerWizardQuiz: WizardQuiz = {
  1: {
    question: "Поділись своїм ім'ям 😊",
    reply: 'Клас, вписав. Тобі личить 😉',
    errorMessage: "Ім'я впиши 🤓",
    validationSchema: Joi.string().regex(/^[a-zA-Zа-яА-ЯҐЄЇІі\-]{2,25}$/),
  },
  2: {
    question: 'Який ти курс?',
    reply: 'А ти поважний 😯',
    errorMessage: 'Вибери щось із варіантів 🤓',
    validAnswers: [
      'Перший',
      'Другий',
      'Третій',
      'Четвертий',
      'Магістратура',
      'Ще в школі',
      'Нічого з переліченого',
    ],
  },
  3: {
    question: 'Де навчаєшся? Впиши свій університет, якщо немає відповіді',
    reply: 'О, а в мене там знайомий вчиться 😃',
    errorMessage: 'Впиши скорочено, якщо не помістилось 🙃',
    validationSchema: Joi.string().regex(/^.{2,75}$/),
    possibleAnswers: [
      'НУЛП',
      'ЛНУ',
      'НЛТУ',
      'УКУ',
      'ЛНМУ',
      'НАСВ',
      'Ще в школі',
      'Закінчив',
      'Нічого з переліченого',
    ],
  },
  4: {
    question: 'Чи ти погоджуєшся на обробку даних? 🙂🙂🙂',
    reply: 'Вітаю! Реєстрація пройшла успішно, вдалого Ярмарку! ✨',
    errorMessage: 'Треба на кнопку Так тикнути, тільки тсс 🤫',
    validAnswers: ['Так 😎'],
  },
};
