import axios from 'axios';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './entities/Book';
import { CreateBookDto } from './dto/CreateBookDto';
import { UpdateBookDto } from './dto/UpdateBookDto';
import { GenreEntity } from '../genres/entities/Genre';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BookService {
  async searchGoogleBooks(query: string): Promise<any[]> {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      const items = response.data.items || [];
      // Adapta para o formato esperado pelo frontend
      return items.map((item: any) => ({
        id: item.id,
        titulo: item.volumeInfo?.title || '',
        autor: Array.isArray(item.volumeInfo?.authors)
          ? item.volumeInfo.authors.join(', ')
          : '',
        capaUrl: item.volumeInfo?.imageLinks?.thumbnail || '',
      }));
    } catch (error) {
      return [];
    }
  }
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private httpService: HttpService,
  ) { }

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
    // Busca a URL da capa
    const coverUrl = await this.fetchBookCoverUrl(
      createBookDto.name,
      createBookDto.author,
    );
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
      coverUrl: coverUrl ?? undefined,
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

  private async fetchBookCoverUrl(
    title: string,
    author?: string,
  ): Promise<string | null> {
    const query = `${title}${author ? ' ' + author : ''}`;
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
    try {
      const response = await this.httpService.get(url).toPromise();
      const items = response?.data?.items;
      if (Array.isArray(items) && items.length > 0) {
        const imageLinks = items[0]?.volumeInfo?.imageLinks;
        return imageLinks?.thumbnail || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
