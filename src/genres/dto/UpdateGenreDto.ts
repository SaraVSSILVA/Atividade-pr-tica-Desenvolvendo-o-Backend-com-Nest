import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './CreateGenreDto';

// O PartialType simplifica, tornando todos os campos opcionais.
export class UpdateGenreDto extends PartialType(CreateGenreDto) {}
