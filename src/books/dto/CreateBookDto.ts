import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { BookStatus, BookPriority } from '../entities/Book';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'O campo nome não pode ser vazio' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo autor não pode ser vazio' })
  @IsOptional()
  @IsString()
  coverUrl?: string;
  author: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsNumber()
  @IsOptional()
  yearPublished?: number;

  @IsNotEmpty({ message: 'O status do livro é obrigatório' })
  @IsEnum(BookStatus, { message: 'Status inválido' })
  status: BookStatus;

  @IsOptional()
  @IsEnum(BookPriority, { message: 'Prioridade inválida' })
  priority?: BookPriority;

  @IsNumber()
  @IsNotEmpty({ message: 'O ID do gênero é obrigatório' })
  genreId: number;
}
