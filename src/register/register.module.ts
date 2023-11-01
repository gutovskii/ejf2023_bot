import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegisterWizard } from './register.wizard';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [RegisterWizard],
})
export class RegisterModule {}
