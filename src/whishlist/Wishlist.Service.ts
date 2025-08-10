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
  ) {}

  async adicionar(dto: CreateWishlistDto): Promise<WishlistEntity> {
    const usuario = await this.userRepository.findOne({
      where: { id: dto.usuarioId },
    });
    const livro = await this.bookRepository.findOne({
      where: { id: dto.livroId },
    });
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
