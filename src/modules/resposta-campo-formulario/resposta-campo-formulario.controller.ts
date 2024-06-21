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
import { RCampoFormularioMapper } from './mapper/resposta-campo-formulario.mapper';
import { UpdateRCampoFormularioDTO } from './dto/update-campo-formulario.dto';
import { CreateRCampoFormularioDTO } from './dto/create-resposta-campo-formulario.dto';
import { RCampoFormularioService } from './resposta-campo-formulario.service';
import { CreateCampoFormularioValidator } from '../campo-formulario/validator/create-campo_formulario.validator';
import { UpdateCampoFormularioValidator } from '../campo-formulario/validator/update-campo_formulario.validator';
import { AppException, ExceptionType } from 'src/core/exception.core';
  
@Controller('/itens')
export class RCampoFormularioController {
    constructor(private readonly service: RCampoFormularioService) {}
  
    @Post()
    async create(
        @Body(CreateCampoFormularioValidator) data: CreateRCampoFormularioDTO
    ) {
        const rcf = await this.service.create(data);
    
        return RCampoFormularioMapper.fromEntityToResponseDTO(rcf);
    }

    @Get()
    async list(@Query('campo_formulario_id', ParseIntPipe)campo_formulario_id: number) {
        if (!campo_formulario_id) {
            throw new AppException ("Deve passar o campo_formulario_id", ExceptionType.INVALID_PARAMS)
        }

        const rcf = await this.service.list(campo_formulario_id);

        return rcf.map(RCampoFormularioMapper.fromEntityToResponseDTO);
    }

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const rcf = await this.service.getById(id);

        return RCampoFormularioMapper.fromEntityToResponseDTO(rcf);
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(UpdateCampoFormularioValidator) data: UpdateRCampoFormularioDTO
    ) {
        const rcf = await this.service.updateById(id, {
        ...data
        });

        return RCampoFormularioMapper.fromEntityToResponseDTO(rcf);
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.service.deleteById(id);
    }
}