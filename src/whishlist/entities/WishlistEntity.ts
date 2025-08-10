import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/User';
import { BookEntity } from '../../books/entities/Book';

@Entity('wishlist')
export class WishlistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  usuario: UserEntity;

  @ManyToOne(() => BookEntity)
  livro: BookEntity;

  @CreateDateColumn()
  dataAdicionado: Date;
}
