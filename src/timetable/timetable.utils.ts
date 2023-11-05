import { TimetableList, timetableList } from './timetable.config';

export const timetableToText = (day: keyof TimetableList) => {
  const timetable = timetableList[day];
  let resultText = '';
  timetable.map((event) => {
    resultText += `<b>${event.name}</b>\n🕙 (${event.dateTerms})\n🗣 ${event.author}\n\n`;
  });
  return resultText;
};
