import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './Book.Service';
import { CreateBookDto } from './dto/CreateBookDto';
import { UpdateBookDto } from './dto/UpdateBookDto';
import { BookEntity } from './entities/Book';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Livros')
@ApiBearerAuth('access-token') // ✅ Informa que precisa de token
@UseGuards(AuthGuard('jwt')) // ✅ Protege todas as rotas
@Controller('livro')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os livros' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(): Promise<BookEntity[]> {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um livro por ID' })
  @ApiResponse({ status: 200, description: 'Livro encontrado.' })
  @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
  async findOne(@Param('id') id: number): Promise<BookEntity> {
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado.`);
    }
    return book;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Cria um novo livro' })
  @ApiResponse({ status: 201, description: 'Livro criado com sucesso.' })
  async create(@Body() createBookDto: CreateBookDto): Promise<BookEntity> {
    return this.bookService.create(createBookDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um livro existente' })
  @ApiResponse({ status: 200, description: 'Livro atualizado com sucesso.' })
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BookEntity> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove um livro por ID' })
  @ApiResponse({ status: 204, description: 'Livro removido com sucesso.' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.bookService.remove(id);
  }
}
