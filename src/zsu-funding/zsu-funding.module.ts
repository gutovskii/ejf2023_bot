import { Module } from '@nestjs/common';
import { ZSUFundingScene } from './zsu-funding.scene';

@Module({
  providers: [ZSUFundingScene],
})
export class ZSUFundingModule {}
