import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistEntity } from './entities/WishlistEntity';
import { UserEntity } from '../users/entities/User';
import { BookEntity, BookStatus, BookPriority } from '../books/entities/Book';
import { CreateWishlistDto } from './dto/CreateWishlistDto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) { }

  async adicionar(dto: CreateWishlistDto): Promise<WishlistEntity> {
    const usuario = await this.userRepository.findOne({
      where: { id: dto.usuarioId },
    });
    let livro = await this.bookRepository.findOne({
      where: { id: dto.livroId },
    });
    // Se o livro não existe, buscar na Google Books API e criar
    if (!livro) {
      // Busca o livro na Google Books API pelo id
      const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
      const url = `https://www.googleapis.com/books/v1/volumes/${dto.livroId}?key=${apiKey}`;
      const response = await axios.get(url);
      type GoogleBooksVolumeInfo = {
        title?: string;
        authors?: string[];
        imageLinks?: { thumbnail?: string };
        description?: string;
        publisher?: string;
        publishedDate?: string;
      };

      type GoogleBooksItem = {
        volumeInfo?: GoogleBooksVolumeInfo;
      };

      const item = response.data as GoogleBooksItem;
      const volumeInfo = item.volumeInfo;
      if (!volumeInfo) {
        throw new NotFoundException(
          'Livro não encontrado na Google Books API.',
        );
      }
      // Cria o livro no banco
      livro = this.bookRepository.create({
        name: volumeInfo.title || '',
        author: Array.isArray(volumeInfo.authors) ? volumeInfo.authors.join(', ') : '',
        coverUrl: volumeInfo.imageLinks?.thumbnail || '',
        description: volumeInfo.description || '',
        publisher: volumeInfo.publisher || '',
        yearPublished: volumeInfo.publishedDate ? parseInt(volumeInfo.publishedDate.substring(0, 4)) : null,
        status: BookStatus.QUERO,
        priority: BookPriority.BAIXA,
    genre: undefined,
      } as Partial<BookEntity>);
      livro = await this.bookRepository.save(livro);
    }
    if (!usuario || !livro) {
      throw new NotFoundException('Usuário ou livro não encontrado.');
    }
    const jaExiste = await this.wishlistRepository.findOne({
      where: { usuario: { id: usuario.id }, livro: { id: livro.id } },
    });
    if (jaExiste) {
      return jaExiste;
    }
    const novoDesejo = this.wishlistRepository.create({ usuario, livro });
    return this.wishlistRepository.save(novoDesejo);
  }

  async remover(usuarioId: number, livroId: number): Promise<void> {
    const desejo = await this.wishlistRepository.findOne({
      where: { usuario: { id: usuarioId }, livro: { id: livroId } },
    });
    if (!desejo) {
      throw new NotFoundException('Livro não está na lista de desejos.');
    }
    await this.wishlistRepository.remove(desejo);
  }

  async listarPorUsuario(usuarioId: number): Promise<WishlistEntity[]> {
    return this.wishlistRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['livro'],
    });
  }
}
