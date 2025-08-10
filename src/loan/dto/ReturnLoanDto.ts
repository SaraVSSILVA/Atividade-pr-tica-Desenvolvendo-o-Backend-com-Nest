import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReturnLoanDto {
  @IsDateString()
  @ApiProperty({
    description: 'Data em que o livro foi devolvido (formato ISO)',
    example: '2025-08-20T14:30:00.000Z',
  })
  dataDevolucao: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Observações sobre a devolução (opcional)',
    example: 'Livro devolvido com capa levemente danificada',
    required: false,
  })
  observacoes?: string;
}
