import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationalStructureDto } from './create-org-structure.dto';

export class UpdateOrganizationalStructureDto extends PartialType(CreateOrganizationalStructureDto) {}
