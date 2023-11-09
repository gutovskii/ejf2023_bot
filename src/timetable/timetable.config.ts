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
      name: 'Воркшоп ОККО',
      author: 'ОККО',
      dateTerms: '11:00-11:45',
    },
    {
      name: 'Обід',
      author: 'Організатори',
      dateTerms: '12:45-13:45',
    },
    {
      name: 'Воркшоп AVR Development',
      author: 'AVR Development',
      dateTerms: '13:45-14:30',
    },
    {
      name: 'Лекція "IT ринок України 2024: чого очікувати?"',
      author: 'Сергій Харитонов',
      dateTerms: '14:30-15:30',
    },
    {
      name: 'Лекція "Цінність навичок проєктного менеджменту в усіх професіях"',
      author: 'Володимир Салига',
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
      name: 'Воркшоп Binance',
      author: 'Binance',
      dateTerms: '11:00-12:00',
    },
    {
      name: 'Лекція',
      author: 'Comming soon',
      dateTerms: '12:00-12:50',
    },
    {
      name: 'Обід',
      author: 'Організатори',
      dateTerms: '12:50-13:50',
    },
    {
      name: 'Виступ на сцені ОККО',
      author: 'OKKO',
      dateTerms: '13:50-14:20',
    },
    {
      name: 'Квест Case Study',
      author: 'Організатори',
      dateTerms: '14:20-16:40',
    },
    {
      name: 'Закриття',
      author: 'Організатори',
      dateTerms: '17:00',
    },
  ],
};

export const timetableText = {
  firstDay: timetableToText('firstDay'),
  secondDay: timetableToText('secondDay'),
};
