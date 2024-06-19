import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/products.dto';
import { Products } from './entity/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './interface/products.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price } = createProductDto;
    const product = this.productsRepository.create({
      name,
      description,
      price,
    });
    return this.productsRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    const list = await this.productsRepository.find();
    if (list.length == 0) {
      throw new NotFoundException('La lista esta vacia');
    }
    return list;
  }

  async getProductsById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con id: ${id} no encontrado`);
    }
    return product;
  }

  async updateById(
    id: number,
    updateProductsDto: Partial<Product>,
  ): Promise<Product> {
    const product = await this.getProductsById(id); // Reutilice el método getUsersById para comprobar si el usuario existe
    Object.assign(product, updateProductsDto);
    return this.productsRepository.save(product);
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const product = await this.getProductsById(id);
    await this.productsRepository.delete(product);
    return { message: `Producto ${product.name} eliminado` };
  }

  async partialUpdate(
    id: number,
    partialUserDto: Partial<CreateProductDto>,
  ): Promise<Product> {
    const product = await this.getProductsById(id);
    Object.assign(product, partialUserDto);
    return this.productsRepository.save(product);
  }
}
