/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { LoanEntity } from './LoanEntity';
import { CreateLoanDto } from './dto/CreateLoanDto';
import { ReturnLoanDto } from './dto/ReturnLoanDto';
import { UserEntity } from '../users/entities/User';
import { BookEntity } from '../books/entities/Book';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanEntity)
    private readonly loanRepository: Repository<LoanEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async create(
    dto: CreateLoanDto,
    usuarioQueEmprestaId: number,
  ): Promise<LoanEntity> {
    const cedente = await this.userRepository.findOne({
      where: { id: usuarioQueEmprestaId },
    });

    const tomador = await this.userRepository.findOne({
      where: { id: dto.usuarioQueRecebeId },
    });

    const livro = await this.bookRepository.findOne({
      where: { id: dto.livroId },
    });

    if (!cedente || !tomador || !livro) {
      throw new HttpException(
        'Usuário ou livro não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const emprestimoExistente = await this.loanRepository.findOne({
      where: {
        livro: { id: dto.livroId },
        returnDate: IsNull(),
      },
    });

    if (emprestimoExistente) {
      throw new HttpException(
        'Este livro já está emprestado.',
        HttpStatus.CONFLICT,
      );
    }

    const novoEmprestimo = this.loanRepository.create({
      cedente,
      tomador,
      livro,
      loanDate: new Date(),
    });

    return this.loanRepository.save(novoEmprestimo);
  }

  async marcarComoDevolvido(
    id: number,
    dto: ReturnLoanDto,
    idUsuario: number,
  ): Promise<LoanEntity> {
    const emprestimo = await this.loanRepository.findOne({
      where: { id },
      relations: ['cedente'],
    });

    if (!emprestimo) {
      throw new HttpException(
        'Empréstimo não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (emprestimo.cedente.id !== idUsuario) {
      throw new HttpException(
        'Usuário não autorizado a marcar devolução.',
        HttpStatus.FORBIDDEN,
      );
    }

    emprestimo.returnDate = new Date(dto.dataDevolucao);

    return this.loanRepository.save(emprestimo);
  }

  async buscarEmprestimosTomadosPorUsuario(
    usuarioId: number,
  ): Promise<LoanEntity[]> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }
    return this.loanRepository.find({
      where: { tomador: { id: usuarioId } },
      relations: ['livro', 'tomador'],
    });
  }

  async buscarEmprestimosConcedidosPorUsuario(
    usuarioId: number,
  ): Promise<LoanEntity[]> {
    return this.loanRepository.find({
      where: { cedente: { id: usuarioId } },
      relations: ['livro', 'cedente'],
    });
  }

  async devolverEmprestimo(id: number): Promise<LoanEntity> {
    const emprestimo = await this.loanRepository.findOne({ where: { id } });

    if (!emprestimo) {
      throw new HttpException(
        'Empréstimo não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    emprestimo.returnDate = new Date();

    return this.loanRepository.save(emprestimo);
  }

  async listarHistoricoPorUsuario(
    id: number,
    status?: 'ativo' | 'concluido',
  ): Promise<LoanEntity[]> {
    const where: any = [{ tomador: { id } }, { cedente: { id } }];

    if (status === 'ativo') {
      where.forEach((w) => (w.returnDate = IsNull()));
    } else if (status === 'concluido') {
      where.forEach((w) => (w.returnDate = Not(IsNull())));
    }

    return this.loanRepository.find({
      where,
      relations: ['livro', 'cedente', 'tomador'],
      order: { loanDate: 'DESC' },
    });
  }
}
