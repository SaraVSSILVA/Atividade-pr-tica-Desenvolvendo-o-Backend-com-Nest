import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { GenreService } from './Genre.Service';
import { CreateGenreDto } from './dto/CreateGenreDto';
import { UpdateGenreDto } from './dto/UpdateGenreDto';
import { GenreEntity } from './entities/Genre';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Gêneros') // ✅ Agrupa no Swagger
@ApiBearerAuth('access-token') // ✅ Informa que precisa de token
@UseGuards(AuthGuard('jwt')) // ✅ Protege todas as rotas
@Controller('genero')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @ApiOperation({ summary: 'Busca todos os gêneros' })
  findAll(): Promise<GenreEntity[]> {
    return this.genreService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo gênero' })
  @HttpCode(201)
  create(@Body() createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    return this.genreService.create(createGenreDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um gênero existente' })
  update(
    @Param('id') id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<GenreEntity> {
    return this.genreService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um gênero por ID' })
  @HttpCode(204)
  remove(@Param('id') id: number): Promise<void> {
    return this.genreService.remove(id);
  }
}
