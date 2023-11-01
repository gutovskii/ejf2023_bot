import { Module } from '@nestjs/common';
import { AboutUsScene } from './about-us.scene';

@Module({
  providers: [AboutUsScene],
})
export class AboutUsModule {}
