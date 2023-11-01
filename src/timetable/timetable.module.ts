import { Module } from '@nestjs/common';
import { TimetableScene } from './timetable.scene';

@Module({
  providers: [TimetableScene],
})
export class TimetableModule {}
