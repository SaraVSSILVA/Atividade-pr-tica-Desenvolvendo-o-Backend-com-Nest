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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LoanService } from './Loan.Service';
import { LoanEntity } from './LoanEntity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateLoanDto } from './dto/CreateLoanDto';
import { ReturnLoanDto } from './dto/ReturnLoanDto';
import { ApiQuery } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
@ApiTags('Empréstimos')
@Controller('/emprestimo')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo empréstimo',
    description: 'Cria um novo empréstimo de livro entre usuários.',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateLoanDto })
  criar(
    @Body() dto: CreateLoanDto,
    @Req() req: Request & { user: { userId: number } },
  ): Promise<LoanEntity> {
    const usuarioQueEmprestaId = req.user['userId'];
    return this.loanService.create(dto, usuarioQueEmprestaId);
  }

  @Get('/tomados-por/:usuarioId')
  @ApiTags('Consulta')
  @ApiOperation({
    summary: 'Listar empréstimos tomados',
    description: 'Lista todos os empréstimos tomados pelo usuário.',
  })
  @ApiParam({
    name: 'usuarioId',
    type: Number,
    description: 'ID do usuário tomador',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de empréstimos tomados pelo usuário.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  buscarEmprestimosTomadosPorUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<LoanEntity[]> {
    return this.loanService.buscarEmprestimosTomadosPorUsuario(usuarioId);
  }

  @Get('/concedidos-por/:usuarioId')
  @ApiTags('Consulta')
  @ApiOperation({
    summary: 'Listar empréstimos concedidos',
    description: 'Lista todos os empréstimos concedidos pelo usuário.',
  })
  @ApiParam({
    name: 'usuarioId',
    type: Number,
    description: 'ID do usuário cedente',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de empréstimos concedidos pelo usuário.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  buscarEmprestimosConcedidosPorUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<LoanEntity[]> {
    return this.loanService.buscarEmprestimosConcedidosPorUsuario(usuarioId);
  }

  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ativo', 'concluido'],
    description: 'Filtra o histórico pelo status do empréstimo',
  })
  @Get('/usuario/:id/historico')
  @ApiTags('Consulta')
  @ApiOperation({
    summary: 'Histórico de empréstimos do usuário',
    description:
      'Lista o histórico de empréstimos do usuário, podendo filtrar por status.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de empréstimos do usuário.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @HttpCode(HttpStatus.OK)
  listarHistoricoPorUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status?: string,
  ): Promise<LoanEntity[]> {
    const statusFiltrado = ['ativo', 'concluido'].includes(status ?? '')
      ? (status as 'ativo' | 'concluido')
      : undefined;

    return this.loanService.listarHistoricoPorUsuario(id, statusFiltrado);
  }

  @Put('/:id/devolver')
  @ApiTags('Devolução')
  @ApiOperation({
    summary: 'Devolver empréstimo',
    description: 'Marca o empréstimo como devolvido.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do empréstimo' })
  @ApiResponse({
    status: 200,
    description: 'Empréstimo devolvido com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Empréstimo não encontrado.' })
  @HttpCode(HttpStatus.OK)
  devolverEmprestimo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoanEntity> {
    return this.loanService.devolverEmprestimo(id);
  }

  @Patch(':id/devolver')
  @ApiTags('Devolução')
  @ApiOperation({
    summary: 'Marcar devolução com data',
    description:
      'Marca o empréstimo como devolvido informando a data de devolução.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do empréstimo' })
  @ApiResponse({
    status: 200,
    description: 'Empréstimo devolvido com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Empréstimo não encontrado.' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ReturnLoanDto })
  marcarComoDevolvido(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReturnLoanDto,
    @Req() req: Request & { user: { userId: number } },
  ): Promise<LoanEntity> {
    const idUsuario = req.user['userId'];
    return this.loanService.marcarComoDevolvido(id, dto, idUsuario);
  }
}
