import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDTO } from './dtos/create-item.dto';
import { CreateItemValidator } from './validators/create-item.validator';
import { UpdateItemDTO } from './dtos/update-item.dto';
import { UpdateItemValidator } from './validators/update-item.validators';
import { ItemMapper } from './mappers/item.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFilePipe } from 'src/components/image-file.pipe';

@Controller('/itens')
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  async create(
    @Body(CreateItemValidator) data: Omit<CreateItemDTO, 'foto'>,
    @UploadedFile(ImageFilePipe) foto?: Express.Multer.File,
  ) {
    const item = await this.service.create({
      ...data,
      foto,
    });

    return ItemMapper.fromEntityToResponseDTO(item);
  }

  @Get()
  async list(@Query('restauranteId', ParseIntPipe) restauranteId: number) {
    const itens = await this.service.list(restauranteId);

    return itens.map(ItemMapper.fromEntityToResponseDTO);
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const item = await this.service.getById(id);

    return ItemMapper.fromEntityToResponseDTO(item);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('foto'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateItemValidator) data: Omit<UpdateItemDTO, 'foto'>,
    @UploadedFile(ImageFilePipe) foto?: Express.Multer.File,
  ) {
    const item = await this.service.updateById(id, {
      ...data,
      foto,
    });

    return ItemMapper.fromEntityToResponseDTO(item);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteById(id);
  }
}
