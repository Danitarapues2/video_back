import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 50, {
    message: 'La longitud del nombre debe ser de al menos 3 letras',
  })
  name: string;

  @IsNotEmpty({ message: 'La descripcion es obligatoria' })
  description: string;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  price: number;
}
