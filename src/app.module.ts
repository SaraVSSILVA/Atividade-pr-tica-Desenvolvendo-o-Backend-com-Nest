import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT') ?? '3306'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [BookEntity, GenreEntity, UserEntity, LoanEntity],
          synchronize: true,
        }) as TypeOrmModuleOptions,
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
