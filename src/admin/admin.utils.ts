import { User } from 'src/register/user.schema';

export const userToText = (user: User) => {
  return `${user.telegramId}\n@${user.username}\n${user.firstname} ${
    user.lastname ?? ''
  }\nЗабананений: ${user.isBanned}\nРоль: ${user.role}\nКурс: ${
    user.course
  }\nAlmaMater: ${user.almaMater}\n\n`;
};
