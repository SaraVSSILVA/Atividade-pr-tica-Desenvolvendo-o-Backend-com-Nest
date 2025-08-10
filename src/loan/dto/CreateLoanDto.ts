import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateLoanDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID do usuário que recebe o empréstimo' })
  usuarioQueRecebeId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID do usuário que empresta o livro' })
  usuarioQueEmprestaId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID do livro que está sendo emprestado' })
  livroId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Data prevista para devolução' })
  dataPrevistaDevolucao: any;
}
