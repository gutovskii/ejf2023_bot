import { FilterQuery } from 'mongoose';
import { Vacancy } from './vacancy.schema';

export const vacancyToText = (v: Vacancy) =>
  `<b><a href="${v.link}">${v.title} </a>${v.salary ?? ''}</b>\n🏢 ${
    v.company
  }\n📆 ${v.date}\n🏙 ${v.cities}\n\n`;

export const vacancySearchFilterQuery = (
  search?: string,
): FilterQuery<Vacancy> => {
  return search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { salary: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { date: { $regex: search, $options: 'i' } },
          { cities: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
};
