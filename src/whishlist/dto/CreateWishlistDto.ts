import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsInt()
  @IsNotEmpty()
  livroId: number;
}
