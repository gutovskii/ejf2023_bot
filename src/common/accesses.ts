import { Role } from 'src/register/role.enum';
import { Markup } from 'telegraf';

export enum Action {
  VIEW_TIMETABLE = 'Розклад 🎊',
  VIEW_VACANCIES = 'Вакансії партнерів 💎',
  QUEST_CASE_STUDY = 'Quest Case Study 🧐',
  VIEW_QUESTIONNAIRES = 'CV студентів 👀',
  UPLOAD_QUESTIONNAIRE = 'Завантажити CV 🧾',
  ABOUT_US = 'Про нас 👥',
  ENTER_ADMIN_PANEL = 'Адмін панель 😎',
}

export const usageAction = {
  [Role.USER]: [
    Action.VIEW_TIMETABLE,
    Action.VIEW_VACANCIES,
    Action.UPLOAD_QUESTIONNAIRE,
    Action.ABOUT_US,
  ],
  [Role.PARTNER]: [
    Action.VIEW_TIMETABLE,
    Action.VIEW_VACANCIES,
    Action.QUEST_CASE_STUDY,
    Action.VIEW_QUESTIONNAIRES,
    Action.ABOUT_US,
  ],
  [Role.ADMIN]: Object.values(Action),
};

export const printActionButtons = (role: Role) => {
  const buttons = usageAction[role].map((actionName: Action) =>
    Markup.button.text(actionName),
  );
  return Markup.keyboard(buttons, { columns: 2 }).resize(true);
};
