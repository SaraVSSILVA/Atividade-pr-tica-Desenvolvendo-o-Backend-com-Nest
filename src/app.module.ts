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
import { WishlistModule } from './whishlist/Wishlist.Module';
import { LoanEntity } from './loan/LoanEntity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      entities: [BookEntity, GenreEntity, UserEntity, LoanEntity],
      synchronize: false,
    }),
    BookModule,
    GenreModule,
    UserModule,
    AuthModule,
    LoanModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
