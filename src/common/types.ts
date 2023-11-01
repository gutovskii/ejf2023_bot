import { User } from 'src/register/user.schema';
import { Context } from 'telegraf';
import { Document } from 'telegraf/typings/core/types/typegram';
import { SceneContext, WizardContext } from 'telegraf/typings/scenes';
import { ValidateAnswerOptions } from './pipes/validate-answer.pipe';

export interface WizardQuestion extends Partial<ValidateAnswerOptions> {
  question: string;
  reply: string;
}

export type WizardQuiz = Record<number, WizardQuestion>;

export interface SessionData {
  user: User;
}

export interface MainContext extends Context {
  session: SessionData;
}

export interface MainSceneContext extends Context, SceneContext {
  session: SessionData & SceneContext['session'];
}

export interface MainWizardContext extends Context, WizardContext {
  session: SessionData & WizardContext['session'];
}

export interface ValidateFileStreamOptions {
  telegramDocument: Document;
  maxSizeInBytes: number;
  extname: string;
}
