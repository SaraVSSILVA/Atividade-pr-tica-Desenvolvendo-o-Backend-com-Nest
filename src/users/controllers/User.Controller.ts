import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/User.Service';
import { UserEntity } from '../entities/User';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Usuários')
@Controller('/usuario')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  @ApiOperation({ summary: 'Busca todos os usuários' })
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  @ApiOperation({ summary: 'Busca um usuário por ID' })
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: UserEntity): Promise<UserEntity> {
    return this.userService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/update')
  @ApiOperation({ summary: 'Atualiza um usuário existente' })
  @HttpCode(HttpStatus.OK)
  async update(@Body() user: UserEntity): Promise<UserEntity> {
    return this.userService.update(user);
  }
}
