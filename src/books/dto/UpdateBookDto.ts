// src/books/dto/UpdateBookDto.ts

import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { BookStatus, BookPriority } from '../entities/Book';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsNumber()
  yearPublished?: number;

  @IsOptional()
  @IsEnum(BookStatus, { message: 'Status inválido' })
  status?: BookStatus;

  @IsOptional()
  @IsEnum(BookPriority, { message: 'Prioridade inválida' })
  priority?: BookPriority;

  @IsOptional()
  @IsNumber()
  genreId?: number;
}
