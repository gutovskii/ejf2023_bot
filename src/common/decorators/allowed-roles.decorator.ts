import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/register/role.enum';

export const ROLES_KEY = 'ROLES';

export const AllowedRoles = (...args: Role[]) => SetMetadata(ROLES_KEY, args);
