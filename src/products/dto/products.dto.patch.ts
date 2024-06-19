import { IsString, Length, IsOptional } from 'class-validator';

export class PatchProductDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 50, {
    message: 'La longitud del nombre debe ser de al menos 3 letras',
  })
  @IsOptional()
  name: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @Length(3, 50, {
    message: 'La longitud del nombre debe ser de al menos 3 letras',
  })
  @IsOptional()
  description: string;

  @IsOptional()
  price: number;
}
