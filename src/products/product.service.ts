// src/products/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../categories/category.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  // 1. Método para criar um novo produto
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    if (!category) {
      throw new NotFoundException(
        `Category with ID "${createProductDto.categoryId}" not found.`,
      );
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category,
    });
    return this.productRepository.save(product);
  }

  // 2. Método para buscar todos os produtos (incluindo a categoria)
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  // 3. Método para buscar um produto por ID (incluindo a categoria)
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: String(id) },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  // 4. Método para atualizar um produto existente
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.categoryId) {
      const newCategory = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );

      if (!newCategory) {
        throw new NotFoundException(
          `Category with ID "${updateProductDto.categoryId}" not found.`,
        );
      }
      product.category = newCategory;
    }

    this.productRepository.merge(product, updateProductDto);
    return this.productRepository.save(product);
  }

  // 5. Método para remover (deletar) um produto
  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
