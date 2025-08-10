import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/entities/User';
import { BookEntity } from '../books/entities/Book';
import { ApiProperty } from '@nestjs/swagger';

@Entity('loans')
export class LoanEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID único do empréstimo', example: 1 })
  id: number;

  @ManyToOne(() => UserEntity)
  @ApiProperty({ description: 'Usuário que emprestou o livro' })
  cedente: UserEntity;

  @ManyToOne(() => UserEntity)
  @ApiProperty({ description: 'Usuário que recebeu o livro emprestado' })
  tomador: UserEntity;

  @ManyToOne(() => BookEntity)
  @ApiProperty({ description: 'Livro emprestado' })
  livro: BookEntity;

  @Column()
  @ApiProperty({
    description: 'Data em que o empréstimo foi realizado',
    example: '2025-08-10T12:00:00.000Z',
  })
  loanDate: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Data em que o livro foi devolvido (se aplicável)',
    example: '2025-08-20T14:30:00.000Z',
    required: false,
  })
  returnDate?: Date;
}
