import { GenreModule } from './../genres/Genre.Module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/Book';
import { BookController } from './Book.Controller';
import { BookService } from './Book.Service';
import { GenreEntity } from '../genres/entities/Genre';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, GenreEntity]),
    GenreModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
