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
import { AppException, ExceptionType } from 'src/core/exception.core';
  
@Controller('/itens')
export class ItemController {
    constructor(private readonly service: ItemService) {}
  
    @Post()
    async create(
        @Body(CreateItemValidator) data: CreateItemDTO
    ) {
        const item = await this.service.create(data);
    
        return ItemMapper.fromEntityToResponseDTO(item);
    }

    @Get()
    async list(@Query('restaurante_id', ParseIntPipe)restaurante_id: number) {
        if (!restaurante_id) {
            throw new AppException ("Deve passar o restaurante_id", ExceptionType.INVALID_PARAMS)
        }

        const itens = await this.service.list(restaurante_id);

        return itens.map(ItemMapper.fromEntityToResponseDTO);
    }

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const item = await this.service.getById(id);

        return ItemMapper.fromEntityToResponseDTO(item);
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(UpdateItemValidator) data: UpdateItemDTO
    ) {
        const item = await this.service.updateById(id, {
        ...data
        });

        return ItemMapper.fromEntityToResponseDTO(item);
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.service.deleteById(id);
    }
}