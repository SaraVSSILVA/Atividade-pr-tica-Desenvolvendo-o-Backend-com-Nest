import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BookEntity } from '../../books/entities/Book';

@Entity({ name: 'genre' })
export class GenreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 100, nullable: false, unique: true })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  // Relação com a entidade Book
  @OneToMany(() => BookEntity, (book) => book.genre)
  books: BookEntity[];
}
