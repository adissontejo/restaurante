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
import { CampoFormularioService } from './campo_formulario.service';
import { CreateCampoFormularioDTO } from './dto/create-campo_formulario.dto';
import { CreateCampoFormularioValidator } from './validator/create-campo_formulario.validator';
import { UpdateCampoFormularioDTO } from './dto/update-campo_formulario.dto';
import { UpdateCampoFormularioValidator } from './validator/update-campo_formulario.validator';
import { CampoFormularioMapper } from './mapper/campo_formulario.mapper';
import { AppException, ExceptionType } from 'src/core/exception.core';
  
@Controller('/campoformulario')
export class CampoFormularioController {
    constructor(private readonly service: CampoFormularioService) {}
  
    @Post()
    async create(
        @Body(CreateCampoFormularioValidator) data: CreateCampoFormularioDTO
    ) {
        const cf = await this.service.create(data);
    
        return CampoFormularioMapper.fromEntityToResponseDTO(cf);
    }

    @Get()
    async list(@Query('item_id', ParseIntPipe)item_id: number) {
        if (!item_id) {
            throw new AppException ("Deve passar o item_id", ExceptionType.INVALID_PARAMS)
        }

        const cfs = await this.service.list(item_id);

        return cfs.map(CampoFormularioMapper.fromEntityToResponseDTO);
    }

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const cf = await this.service.getById(id);

        return CampoFormularioMapper.fromEntityToResponseDTO(cf);
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(UpdateCampoFormularioValidator) data: UpdateCampoFormularioDTO
    ) {
        const cf = await this.service.updateById(id, {
        ...data
        });

        return CampoFormularioMapper.fromEntityToResponseDTO(cf);
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.service.deleteById(id);
    }
}