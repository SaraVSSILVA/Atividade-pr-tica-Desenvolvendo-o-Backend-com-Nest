import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistEntity } from './entities/WishlistEntity';
import { UserEntity } from '../users/entities/User';
import { BookEntity } from '../books/entities/Book';
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
      const axios = require('axios');
      const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
      const url = `https://www.googleapis.com/books/v1/volumes/${dto.livroId}?key=${apiKey}`;
      const response = await axios.get(url);
      const item = response.data;
      if (!item || !item.volumeInfo) {
        throw new NotFoundException(
          'Livro não encontrado na Google Books API.',
        );
      }
      // Cria o livro no banco
      livro = this.bookRepository.create({
        id: dto.livroId,
        name: item.volumeInfo.title || '',
        author: Array.isArray(item.volumeInfo.authors)
          ? item.volumeInfo.authors.join(', ')
          : '',
        coverUrl: item.volumeInfo.imageLinks?.thumbnail || '',
        description: item.volumeInfo.description || '',
        publisher: item.volumeInfo.publisher || '',
        yearPublished: item.volumeInfo.publishedDate
          ? parseInt(item.volumeInfo.publishedDate)
          : null,
        status: 'Quero',
        priority: 'BAIXA',
      });
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
