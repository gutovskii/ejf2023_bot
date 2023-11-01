import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MainContext } from 'src/common/types';
import { User } from 'src/register/user.schema';

const USERS_PER_PAUSE = 5;
const INTERVAL_MS = 3000;

@Injectable()
export class BroadcastMessageService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async broadcastMessage(
    message: string,
    query: FilterQuery<User>,
    ctx: MainContext,
  ) {
    const users = await this.userModel.find(query);
    for (let i = 0; i < users.length; i++) {
      if (i % USERS_PER_PAUSE === 0) {
        await this.pause(INTERVAL_MS);
      }
      ctx.telegram
        .sendMessage(users[i].telegramId, message)
        .catch(() => console.log('err'));
    }
  }

  private pause(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
