import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do gênero não pode ser vazio' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
