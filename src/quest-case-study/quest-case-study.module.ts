import { Module } from '@nestjs/common';
import { QuestCaseStudyScene } from './quest-case-study.scene';

@Module({
  providers: [QuestCaseStudyScene],
})
export class QuestCaseStudyModule {}
