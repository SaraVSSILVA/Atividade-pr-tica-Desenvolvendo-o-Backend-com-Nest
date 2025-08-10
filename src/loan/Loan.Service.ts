import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    idUsuarioQueEmpresta: number,
  ): Promise<LoanEntity> {
    const cedente = await this.userRepository.findOne({
      where: { id: idUsuarioQueEmpresta },
    });
    const tomador = await this.userRepository.findOne({
      where: { id: dto.UsurarioQueRecebeId },
    });
    const livro = await this.bookRepository.findOne({
      where: { id: dto.LivroId },
    });

    if (!cedente || !tomador || !livro) {
      throw new HttpException(
        'Usuário ou livro não encontrado.',
        HttpStatus.BAD_REQUEST,
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
      relations: ['lender'],
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
}
