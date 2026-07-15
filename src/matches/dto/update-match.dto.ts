/* tf_m1-m2-m3/src/matches/dto/update-match.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}
