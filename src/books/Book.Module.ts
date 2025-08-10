import { GenreModule } from './../genres/Genre.Module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/Book';
import { BookController } from './Book.Controller';
import { BookService } from './Book.Service';
import { GenreEntity } from '../genres/entities/Genre';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, GenreEntity]),
    GenreModule,
    AuthModule,
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
