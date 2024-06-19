import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './entity/products.entity';
import { PutProductDto } from './dto/products.dto.put';
import { CreateProductDto } from './dto/products.dto';
import { PatchProductDto } from './dto/products.dto.patch';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ): Promise<any> {
    try {
      const product = await this.productsService.create(createProductDto);
      return {
        message: 'Producto creado correctamente',
        product: {
          name: product.name,
          description: product.description,
          price: product.price,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Error al crear el producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<Products[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: () =>
          new BadRequestException(
            'El ID proporcionado no es un número entero válido',
          ),
      }),
    )
    id: number,
  ): Promise<Products> {
    return await this.productsService.getProductsById(id);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: () =>
          new BadRequestException(
            'El ID proporcionado no es un número entero válido',
          ),
      }),
    )
    id: number,

    @Body(ValidationPipe) putProductDto: PutProductDto,
  ): Promise<Products> {
    try {
      return this.productsService.updateById(id, putProductDto);
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async partialUpdate(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () =>
          new BadRequestException(
            'El ID proporcionado no es un número entero válido',
          ),
      }),
    )
    id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    patchProductDto: PatchProductDto,
  ): Promise<Products> {
    try {
      return await this.productsService.partialUpdate(id, patchProductDto);
    } catch (error) {
      throw new HttpException(
        'Error al actualizar parcialmente el producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: () =>
          new BadRequestException(
            'El ID proporcionado no es un númeroooo entero válido',
          ),
      }),
    )
    id: number,
  ): Promise<string> {
    try {
      await this.productsService.deleteProduct(id);
      return `Producto con id: ${id} a sido eliminado`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          `Error en eliminar producto con el id: ${id}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
