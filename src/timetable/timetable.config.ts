import { timetableToText } from './timetable.utils';

export interface TimetableEvent {
  name: string;
  description?: string;
  author: string;
  dateTerms: string;
}

export type TimetableList = Record<'firstDay' | 'secondDay', TimetableEvent[]>;

export const timetableList: TimetableList = {
  firstDay: [
    {
      name: 'Відкриття',
      author: 'Організатори',
      dateTerms: '10:00-10:30',
    },
    {
      name: 'Виступ на сцені AVR Development',
      author: 'AVR Development',
      dateTerms: '10:30-11:00',
    },
    {
      name: 'Воркшоп ОККО: "Як розвивати критичне мислення в турбулентні часи?"',
      author: 'ОККО, 209 авдиторія 4 н.к.',
      dateTerms: '11:00-11:45',
    },
    {
      name: 'Виступ на сцені Sombra: "Можливості перед вами: Де шукати і як використовувати їх"',
      author: 'Sombra',
      dateTerms: '11:45-12:15',
    },
    {
      name: 'Тестові співбесіди від OKKO та AVR Development',
      author: 'OKKO, AVR Development, 209 авдиторія 4 н.к',
      dateTerms: '12:15-12:45',
    },
    {
      name: 'Обід',
      author: 'Організатори',
      dateTerms: '12:45-13:45',
    },
    {
      name: 'Воркшоп Binance: "WEB3 та Блокчейн або світ повний можливостей для студентів"',
      author: 'Binance, 209 авдиторыя 4 н.к.',
      dateTerms: '13:30-14:15',
    },
    {
      name: 'Лекція "IT ринок України 2024: чого очікувати?"',
      author: 'Спікер: Сергій Харитонов, 209 авдиторія 4 н.к.',
      dateTerms: '14:30-15:30',
    },
    {
      name: 'Лекція "Цінність навичок проєктного менеджменту в усіх професіях"',
      author: 'Спікер: Володимир Салига, 209 авдиторія 4 н.к.',
      dateTerms: '15:45-16:45',
    },
    {
      name: 'Закриття',
      author: 'Організатори',
      dateTerms: '17:00',
    },
  ],
  secondDay: [
    {
      name: 'Відкриття',
      author: 'Організатори',
      dateTerms: '10:00-10:30',
    },
    {
      name: 'Воркшоп AVR Development',
      author: 'AVR Development, 209 авдиторія 4 н.к.',
      dateTerms: '11:00-11:45',
    },
    {
      name: 'Лекція "Як шукати роботу в IT та аналізувати ринок в умовах війни"',
      author: 'Спікер: Віолетта Хариш, 209 авдиторія 4 н.к.',
      dateTerms: '11:45-12:45',
    },
    {
      name: 'Обід',
      author: 'Організатори',
      dateTerms: '12:45-13:30',
    },
    {
      name: 'Виступ на сцені ОККО: "Сучасні технології та прогресивні рішення"',
      author: 'OKKO',
      dateTerms: '13:30-14:00',
    },
    {
      name: 'Квест Case Study',
      author: 'Органі затори',
      dateTerms: '14:00-16:20',
    },
    {
      name: 'Тестові співбесіди від OKKO та AVR Development',
      author: 'OKKO, AVR Development, 209 авдиторія 4 н.к.',
      dateTerms: '16:20-17:00',
    },
    {
      name: 'Офіційне закриття + результати збору-розіграшу',
      author: 'Організатори',
      dateTerms: '17:00',
    },
  ],
};

export const timetableText = {
  firstDay: timetableToText('firstDay'),
  secondDay: timetableToText('secondDay'),
};
