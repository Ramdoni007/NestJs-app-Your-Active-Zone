import { SetMetadata } from '@nestjs/common';

export type Roles = 'admin' | 'user' | 'creator';
export const Roles_KEY = 'roles';

export const Roles = (...roles: Roles[]) => SetMetadata(Roles_KEY, roles);
