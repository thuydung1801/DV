import { PartialType } from '@nestjs/swagger';
import { CreateTtDto } from './create-tt.dto';

export class UpdateTtDto extends PartialType(CreateTtDto) {}
