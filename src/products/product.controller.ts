// src/products/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products') // Define o prefixo da rota
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 1. Rota para criar um novo produto (POST /products)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // 2. Rota para buscar todos os produtos (GET /products)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.productsService.findAll();
  }

  // 3. Rota para buscar um produto por ID (GET /products/:id)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe para validar e converter
    return this.productsService.findOne(id);
  }

  // 4. Rota para atualizar um produto (PUT /products/:id)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // 5. Rota para remover um produto (DELETE /products/:id)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }
}
