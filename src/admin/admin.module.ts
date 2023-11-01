import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/register/user.schema';
import { AdminScene } from './admin.scene';
import { BroadcastMessageService } from './broadcast-message.service';
import { BanUserWizard } from './wizards/ban-user.wizard';
import { BroadcastMessageWizard } from './wizards/broadcast-message.wizard';
import { ChangeRoleWizard } from './wizards/change-role.wizard';
import { FindUserWizard } from './wizards/find-user.wizard';
import { MessageToUserWizard } from './wizards/message-to-user.wizard';
import { ShowBannedWizard } from './wizards/show-banned.wizard';
import { UnbanUserWizard } from './wizards/unban-user.wizard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    AdminScene,
    FindUserWizard,
    ChangeRoleWizard,
    BanUserWizard,
    UnbanUserWizard,
    MessageToUserWizard,
    ShowBannedWizard,
    BroadcastMessageWizard,
    BroadcastMessageService,
  ],
})
export class AdminModule {}
