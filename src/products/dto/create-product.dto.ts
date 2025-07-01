import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

import { Type } from 'class-transformer'; // Para transformação de tipos

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0) // Garante que o preço não é negativo
  @Type(() => Number) // Garante que o valor recebido seja transformado em Number
  price: number;

  @IsNumber()
  @Min(0) // Garante que o estoque não é negativo
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  categoryId: number; // O ID da categoria à qual este produto pertence
}
