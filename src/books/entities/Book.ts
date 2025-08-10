// src/books/entities/Book.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GenreEntity } from '../../genres/entities/Genre';

// Enum para o status do livro
export enum BookStatus {
  TENHO = 'Tenho',
  QUERO = 'Quero',
  LENDO = 'Lendo',
  LIDO = 'Lido',
}

// Enum para a prioridade de leitura
export enum BookPriority {
  ALTA = 'Alta',
  MEDIA = 'Média',
  BAIXA = 'Baixa',
}

@Entity({ name: 'book' }) // Nome da tabela no banco de dados
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 150, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'author', length: 100, nullable: false })
  author: string;

  @Column({ name: 'publisher', length: 100, nullable: true })
  publisher: string;

  @Column({ name: 'year_published', type: 'int', nullable: true })
  yearPublished: number;

  // Novo campo para o status do livro, usando o enum
  @Column({ name: 'status', type: 'enum', enum: BookStatus, default: BookStatus.QUERO })
  status: BookStatus;

  // Novo campo para a prioridade de leitura, usando o enum
  @Column({ name: 'priority', type: 'enum', enum: BookPriority, default: BookPriority.BAIXA })
  priority: BookPriority;

  // Relacionamento com a entidade Genre
  @ManyToOne(() => GenreEntity, (genre) => genre.books, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'genre_id' })
  genre: GenreEntity;
}
