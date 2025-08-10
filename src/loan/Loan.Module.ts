import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanEntity } from './LoanEntity';
import { LoanService } from './Loan.Service';
import { LoanController } from './Loan.Controller';
import { BookEntity } from '../books/entities/Book';
import { UserModule } from '../users/User.Module';
import { UserEntity } from '../users/entities/User';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanEntity, BookEntity, UserEntity]),
    UserModule,
  ],
  providers: [LoanService],
  controllers: [LoanController],
})
export class LoanModule {}
