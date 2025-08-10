// src/books/Book.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './entities/Book';
import { CreateBookDto } from './dto/CreateBookDto';
import { UpdateBookDto } from './dto/UpdateBookDto';
import { GenreEntity } from '../genres/entities/Genre';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {}

  async findAll(): Promise<BookEntity[]> {
    // Retorna todos os livros, incluindo os dados do gênero associado
    return this.bookRepository.find({ relations: ['genre'] });
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['genre'],
    });

    if (!book) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado`);
    }

    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<BookEntity> {
    // Primeiro, verifica se o gênero existe
    const genre = await this.genreRepository.findOne({
      where: { id: createBookDto.genreId },
    });
    if (!genre) {
      throw new NotFoundException(
        `Gênero com ID ${createBookDto.genreId} não encontrado.`,
      );
    }

    // Cria uma nova instância do livro e salva no banco
    const newBook = this.bookRepository.create({
      ...createBookDto,
      genre, // Associa a entidade de gênero
    });
    return this.bookRepository.save(newBook);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<BookEntity> {
    const existingBook = await this.bookRepository.preload({
      id: id,
      ...updateBookDto,
    });

    if (!existingBook) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado`);
    }

    // Se o genreId for passado, busca o gênero e o associa
    if (updateBookDto.genreId) {
      const genre = await this.genreRepository.findOne({
        where: { id: updateBookDto.genreId },
      });
      if (!genre) {
        throw new NotFoundException(
          `Gênero com ID ${updateBookDto.genreId} não encontrado.`,
        );
      }
      existingBook.genre = genre;
    }

    return this.bookRepository.save(existingBook);
  }

  async remove(id: number): Promise<void> {
    const bookToRemove = await this.findOne(id);
    await this.bookRepository.remove(bookToRemove);
  }
}
