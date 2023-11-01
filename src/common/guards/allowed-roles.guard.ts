import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Role } from 'src/register/role.enum';
import { ROLES_KEY } from '../decorators/allowed-roles.decorator';
import { MainContext } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles.length) return true;
    const execCtx = TelegrafExecutionContext.create(context);
    const ctx = execCtx.getContext<MainContext>();
    const { user } = ctx.session;
    const canPass = requiredRoles.some((role) => role === user.role);
    if (!canPass) {
      await ctx.reply('На шо ти надіявся 🤓');
      return false;
    }
    return true;
  }
}
