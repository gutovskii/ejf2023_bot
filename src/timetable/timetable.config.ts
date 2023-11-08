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
      name: 'Виступ на сцені AVR Development',
      author: 'Aviar',
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
      author: 'Aviar',
      dateTerms: '13:45-14:30',
    },
    {
      name: 'Лекція пана Харитонова',
      author: 'Пан Харитонов',
      dateTerms: '14:30-15:30',
    },
    {
      name: 'Закриття першого дня',
      author: 'Організатори',
      dateTerms: '17:00',
    },
  ],
  secondDay: [
    {
      name: 'Відкриття',
      author: 'Організатори',
      dateTerms: '09:00-10:00',
    },
    {
      name: 'Воркшоп Binance',
      author: 'Binance',
      dateTerms: '11:00-12:00',
    },
    {
      name: 'Обід',
      author: 'Організатори',
      dateTerms: '12:50-13:50',
    },
    {
      name: 'Quest Case Study',
      author: 'Організатори',
      dateTerms: '14:00-16:30',
    },
    {
      name: 'Закриття другого дня',
      author: 'Організатори',
      dateTerms: '17:00',
    },
  ],
};

export const timetableText = {
  firstDay: timetableToText('firstDay'),
  secondDay: timetableToText('secondDay'),
};
