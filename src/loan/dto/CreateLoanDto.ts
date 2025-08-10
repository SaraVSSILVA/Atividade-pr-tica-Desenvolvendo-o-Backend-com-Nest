import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLoanDto {
  @IsInt()
  @IsNotEmpty()
  UsurarioQueRecebeId: number;

  @IsInt()
  @IsNotEmpty()
  UsuarioQueEmprestaId: number;

  @IsInt()
  @IsNotEmpty()
  LivroId: number;
}
