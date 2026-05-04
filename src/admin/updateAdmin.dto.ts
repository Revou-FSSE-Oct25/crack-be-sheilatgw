import { PartialType } from '@nestjs/mapped-types';
import { AdminDto } from './admin.dto'

export class UpdateAdminDto extends PartialType(AdminDto) {}