import { PartialType } from '@nestjs/mapped-types';
import { CreateRestriccioneDto } from './create-restriccion.dto';

export class UpdateRestriccioneDto extends PartialType(CreateRestriccioneDto) {}
