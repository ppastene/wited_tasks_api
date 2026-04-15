import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @ApiProperty({ example: '1', description: 'Numero de la pagina' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @ApiProperty({ example: '10', description: 'Cantidad de elementos en la consulta' })
  limit?: number;
}