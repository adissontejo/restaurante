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
import { OpcaoService } from './opcao.service';
import { CreateOpcaoDTO } from './dto/create-opcao.dto';
import { CreateOpcaoValidator } from './validator/create-opcao.validator';
import { UpdateOpcaoDTO } from './dto/update-opcao.dto';
import { UpdateOpcaoValidator } from './validator/update-opcao.valaidator';
import { OpcaoMapper } from './mapper/opcao.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFilePipe } from 'src/components/image-file.pipe';
import { AppException, ExceptionType } from 'src/core/exception.core';
  
@Controller('/opcao')
export class OpcaoController {
    constructor(private readonly service: OpcaoService) {}
  
    @Post()
    async create(
        @Body(CreateOpcaoValidator) data: CreateOpcaoDTO
    ) {
        const opcao = await this.service.create(data);
    
        return OpcaoMapper.fromEntityToResponseDTO(opcao);
    }

    @Get()
    async list(@Query('campo_formulario_id', ParseIntPipe)campo_formulario_id: number) {
        if (!campo_formulario_id) {
            throw new AppException ("Deve passar o campo_formulario_id", ExceptionType.INVALID_PARAMS)
        }

        const opcoes = await this.service.list(campo_formulario_id);

        return opcoes.map(OpcaoMapper.fromEntityToResponseDTO);
    }

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const opcao = await this.service.getById(id);

        return OpcaoMapper.fromEntityToResponseDTO(opcao);
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(UpdateOpcaoValidator) data: UpdateOpcaoDTO
    ) {
        const opcao = await this.service.updateById(id, {
        ...data
        });

        return OpcaoMapper.fromEntityToResponseDTO(opcao);
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.service.deleteById(id);
    }
}