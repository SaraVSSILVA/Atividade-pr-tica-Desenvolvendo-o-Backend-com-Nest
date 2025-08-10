import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LoanService } from './Loan.Service';
import { LoanEntity } from './LoanEntity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateLoanDto } from './dto/CreateLoanDto';
import { ReturnLoanDto } from './dto/ReturnLoanDto';

@ApiTags('Empréstimos')
@Controller('/emprestimo')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateLoanDto })
  create(
    @Body() dto: CreateLoanDto,
    @Req() req: Request & { user: { userId: number } },
  ): Promise<LoanEntity> {
    const idUsuarioQueEmpresta = req.user['userId'];
    return this.loanService.create(dto, idUsuarioQueEmpresta);
  }

  @Get('/tomados-por/:usuarioId')
  @HttpCode(HttpStatus.OK)
  buscarEmprestimosTomadosPorUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<LoanEntity[]> {
    return this.loanService.buscarEmprestimosTomadosPorUsuario(usuarioId);
  }

  @Get('/concedidos-por/:usuarioId')
  @HttpCode(HttpStatus.OK)
  buscarEmprestimosConcedidosPorUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<LoanEntity[]> {
    return this.loanService.buscarEmprestimosConcedidosPorUsuario(usuarioId);
  }

  @Put('/:id/devolver')
  @HttpCode(HttpStatus.OK)
  devolverEmprestimo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoanEntity> {
    return this.loanService.devolverEmprestimo(id);
  }

  @Patch(':id/devolver')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ReturnLoanDto })
  devolver(
    @Param('id') id: number,
    @Body() dto: ReturnLoanDto,
    @Req() req: Request & { user: { userId: number } },
  ): Promise<LoanEntity> {
    const idUsuario = req.user['userId'];
    return this.loanService.marcarComoDevolvido(id, dto, idUsuario);
  }
}
