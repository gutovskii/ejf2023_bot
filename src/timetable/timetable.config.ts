import { timetableToText } from './timetable.utils';

export interface TimetableEvent {
  name: string;
  description: string;
  author: string;
  dateTerms: string;
}

export type TimetableList = Record<'firstDay' | 'secondDay', TimetableEvent[]>;

export const timetableList: TimetableList = {
  firstDay: [
    {
      name: 'Event 1 Day 1',
      description: 'Very interesting event',
      author: 'SoftServe',
      dateTerms: '03:03-03:42',
    },
    {
      name: 'Event 2 Day 1',
      description: 'Very interesting event',
      author: 'SoftServe',
      dateTerms: '03:03-03:42',
    },
  ],
  secondDay: [
    {
      name: 'Event 1 Day 2',
      description: 'Very interesting event',
      author: 'SoftServe',
      dateTerms: '03:03-03:42',
    },
    {
      name: 'Event 2 Day 2',
      description: 'Very interesting event',
      author: 'SoftServe',
      dateTerms: '03:03-03:42',
    },
  ],
};

export const timetableText = {
  firstDay: timetableToText('firstDay'),
  secondDay: timetableToText('secondDay'),
};
