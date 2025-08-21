interface GoogleBooksApiResponse {
  items?: GoogleBooksApiItem[];
}

interface GoogleBooksApiItem {
  id?: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}
import axios from 'axios';

export interface GoogleBook {
  id: string;
  titulo: string;
  autor: string;
  capaUrl: string;
}

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
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private httpService: HttpService,
  ) {}

  async findByOwner(usuarioId: number): Promise<BookEntity[]> {
    return this.bookRepository.find({
      where: { owner: { id: usuarioId } },
      relations: ['genre', 'owner'],
    });
  }

  async searchGoogleBooks(query: string): Promise<GoogleBook[]> {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
    try {
      const response = await axios.get<GoogleBooksApiResponse>(url);
      const items = Array.isArray(response.data.items)
        ? response.data.items
        : [];
      return items.map((item) => {
        const bookId = item.id ?? '';
        const volumeInfo = item.volumeInfo ?? {};
        const title = volumeInfo.title ?? '';
        const authors = Array.isArray(volumeInfo.authors)
          ? volumeInfo.authors.join(', ')
          : '';
        const capaUrl = volumeInfo.imageLinks?.thumbnail ?? '';
        return {
          id: bookId,
          titulo: title,
          autor: authors,
          capaUrl: capaUrl,
        };
      });
    } catch (error) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
          ? (error as { message: string }).message
          : String(error);
      console.error('Erro ao buscar livros:', message);
      return [];
    }
  }

  async findAll(): Promise<BookEntity[]> {
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
      const response = await this.httpService
        .get<GoogleBooksApiResponse>(url)
        .toPromise();
      const items = Array.isArray(response?.data?.items)
        ? response.data.items
        : [];
      if (items.length > 0) {
        const volumeInfo = items[0].volumeInfo ?? {};
        const thumbnail = volumeInfo.imageLinks?.thumbnail ?? null;
        return thumbnail;
      }
      return null;
    } catch (error) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
          ? (error as { message: string }).message
          : String(error);
      console.error('Erro na chamada da API do Google Books:', message);
      return null;
    }
  }
}
