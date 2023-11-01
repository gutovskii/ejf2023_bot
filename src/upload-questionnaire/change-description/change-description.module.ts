import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Questionnaire, QuestionnaireSchema } from '../questionnaire.schema';
import { ChangeDescriptionScene } from './change-description.scene';
import { ChangeDescriptionBioWizard } from './wizards/change-bio.wizard';
import { ChangeDescriptionFullnameWizard } from './wizards/change-fullname.wizard';
import { ChangeDescriptionLevelWizard } from './wizards/change-position.wizard';
import { ChangeDescriptionTechnologiesWizard } from './wizards/change-technologies.wizard';

@Module({
  providers: [
    ChangeDescriptionScene,
    ChangeDescriptionFullnameWizard,
    ChangeDescriptionLevelWizard,
    ChangeDescriptionTechnologiesWizard,
    ChangeDescriptionBioWizard,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Questionnaire.name, schema: QuestionnaireSchema },
    ]),
  ],
})
export class ChangeDescriptionModule {}
