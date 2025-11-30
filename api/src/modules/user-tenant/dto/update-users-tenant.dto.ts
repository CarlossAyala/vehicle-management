import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersTenantDto } from './create-users-tenant.dto';

export class UpdateUsersTenantDto extends PartialType(CreateUsersTenantDto) {}
