import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
export class UpdateProductDto extends PartialType(CreateProductDto) {
  // Herda todas as propriedades de CreateProductDto, mas as torna opcionais.
  // Isso permite que você envie apenas os campos que deseja atualizar.
}
