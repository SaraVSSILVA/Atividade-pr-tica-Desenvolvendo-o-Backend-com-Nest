import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './Wishlist.Service';
import { CreateWishlistDto } from './dto/CreateWishlistDto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Lista de Desejos')
@Controller('/lista de desejo')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar livro à lista de desejos' })
  @ApiBody({ type: CreateWishlistDto })
  @HttpCode(HttpStatus.CREATED)
  adicionar(@Body() dto: CreateWishlistDto) {
    return this.wishlistService.adicionar(dto);
  }

  @Delete(':usuarioId/:livroId')
  @ApiOperation({ summary: 'Remover livro da lista de desejos' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiParam({ name: 'livroId', type: Number })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('livroId', ParseIntPipe) livroId: number,
  ) {
    await this.wishlistService.remover(usuarioId, livroId);
  }

  @Get(':usuarioId')
  @ApiOperation({ summary: 'Listar livros da lista de desejos do usuário' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @HttpCode(HttpStatus.OK)
  listarPorUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.wishlistService.listarPorUsuario(usuarioId);
  }
}
