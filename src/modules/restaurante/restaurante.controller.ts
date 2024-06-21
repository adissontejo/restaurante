import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { CreateRestauranteDTO } from './dtos/create-restaurante.dto';
import { CreateRestauranteValidator } from './validators/create-restaurante.validator';
import { UpdateRestauranteDTO } from './dtos/update-restaurate.dto';
import { UpdateRestauranteValidator } from './validators/update-restaurante-validator';
import { RestauranteMapper } from './mappers/restaurante.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFilePipe } from 'src/components/image-file.pipe';
import { UseAuthentication } from '../auth/decorators/use-authentication.decorator';

@Controller('/restaurantes')
export class RestauranteController {
  constructor(private readonly service: RestauranteService) {}

  @Post()
  @UseAuthentication()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body(CreateRestauranteValidator) data: Omit<CreateRestauranteDTO, 'logo'>,
    @UploadedFile(ImageFilePipe) logo?: Express.Multer.File,
  ) {
    const restaurante = await this.service.create({
      ...data,
      logo,
    });

    return RestauranteMapper.fromEntityToResponseDTO(restaurante);
  }

  @Get()
  async list() {
    const restaurantes = await this.service.list();

    return restaurantes.map(RestauranteMapper.fromEntityToResponseDTO);
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const restaurante = await this.service.getById(id);

    return RestauranteMapper.fromEntityToResponseDTO(restaurante);
  }

  @Get('/by-dominio/:dominio')
  async getByDominio(@Param('dominio') dominio: string) {
    const restaurante = await this.service.getByDominio(dominio);

    return RestauranteMapper.fromEntityToResponseDTO(restaurante);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateRestauranteValidator) data: Omit<UpdateRestauranteDTO, 'logo'>,
    @UploadedFile(ImageFilePipe) logo?: Express.Multer.File,
  ) {
    const restaurante = await this.service.updateById(id, {
      ...data,
      logo,
    });

    return RestauranteMapper.fromEntityToResponseDTO(restaurante);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteById(id);
  }
}
