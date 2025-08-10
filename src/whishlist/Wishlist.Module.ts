import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/WishlistEntity';
import { WishlistService } from './Wishlist.Service';
import { WishlistController } from './Wishlist.Controller';
import { UserEntity } from '../users/entities/User';
import { BookEntity } from '../books/entities/Book';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistEntity, UserEntity, BookEntity])],
  providers: [WishlistService],
  controllers: [WishlistController],
})
export class WishlistModule {}
