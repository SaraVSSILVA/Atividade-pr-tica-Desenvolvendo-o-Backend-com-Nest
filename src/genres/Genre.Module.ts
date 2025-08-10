import { Module } from '@nestjs/common';
import { GenreService } from './Genre.Service';
import { GenreController } from './Genre.Controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from './entities/Genre';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule { }
