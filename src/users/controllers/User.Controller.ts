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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@Controller('/users')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: UserEntity): Promise<UserEntity> {
    return this.userService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/update')
  @HttpCode(HttpStatus.OK)
  async update(@Body() user: UserEntity): Promise<UserEntity> {
    return this.userService.update(user);
  }
}
