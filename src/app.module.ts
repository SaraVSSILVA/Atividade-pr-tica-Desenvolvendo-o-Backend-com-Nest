// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookEntity } from './books/entities/Book';
import { GenreEntity } from './genres/entities/Genre';
import { GenreModule } from './genres/Genre.Module';
import { BookModule } from './books/Book.Module';
import { UserEntity } from './users/entities/User';
import { UserModule } from './users/User.Module';
import { AuthModule } from './auth/auth.module';
import { LoanModule } from './loan/Loan.Module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_catalogo_livros',
      entities: [BookEntity, GenreEntity, UserEntity],
      synchronize: true,
    }),
    BookModule,
    GenreModule,
    UserModule,
    AuthModule,
    LoanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
