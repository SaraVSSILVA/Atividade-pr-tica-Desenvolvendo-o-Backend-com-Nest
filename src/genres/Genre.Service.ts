// src/genres/Genre.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenreEntity } from './entities/Genre';
import { CreateGenreDto } from './dto/CreateGenreDto';
import { UpdateGenreDto } from './dto/UpdateGenreDto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {}

  async findAll(): Promise<GenreEntity[]> {
    // Retorna todos os gêneros
    return this.genreRepository.find();
  }

  async findOne(id: number): Promise<GenreEntity> {
    const genre = await this.genreRepository.findOne({ where: { id } });

    if (!genre) {
      throw new NotFoundException(`Gênero com ID ${id} não encontrado`);
    }

    return genre;
  }

  async create(createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    // Cria uma nova instância do gênero e salva no banco
    const newGenre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(newGenre);
  }

  async update(
    id: number,
    updateGenreDto: UpdateGenreDto,
  ): Promise<GenreEntity> {
    // Carrega o gênero existente e atualiza os campos
    const existingGenre = await this.genreRepository.preload({
      id: id,
      ...updateGenreDto,
    });

    if (!existingGenre) {
      throw new NotFoundException(`Gênero com ID ${id} não encontrado`);
    }

    return this.genreRepository.save(existingGenre);
  }

  async remove(id: number): Promise<void> {
    const genreToRemove = await this.findOne(id);
    await this.genreRepository.remove(genreToRemove);
  }
}
