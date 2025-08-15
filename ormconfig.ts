import { DataSource } from 'typeorm';
import { GenreEntity } from './src/genres/entities/Genre';
import { UserEntity } from './src/users/entities/User';
import { LoanEntity } from './src/loan/LoanEntity';
import { BookEntity } from './src/books/entities/Book';
import 'dotenv/config';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    BookEntity,
    GenreEntity,
    UserEntity,
    LoanEntity,
    require('./src/whishlist/entities/WishlistEntity').WishlistEntity,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
