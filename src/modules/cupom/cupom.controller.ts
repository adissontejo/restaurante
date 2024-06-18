import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CupomService } from './cupom.service';
import { CreateCupomDTO } from './dtos/create-cupom.dto';
import { CreateCupomValidator } from './validators/create-cupom.validator';
import { UpdateCupomDTO } from './dtos/update-cupom.dto';
import { UpdateCupomValidator } from './validators/update-cupom-validator';
import { CupomMapper } from './mappers/cupom.mapper';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/cupons')
export class CupomController {
  constructor(private readonly service: CupomService) {}

  @Post()
  async create(
    @Body(CreateCupomValidator) data: CreateCupomDTO
  ) {
    const cupom = await this.service.create(data);

    return CupomMapper.fromEntityToResponseDTO(cupom);
  }

  @Get()
  async list() {
    const cupons = await this.service.list();

    return cupons.map(CupomMapper.fromEntityToResponseDTO);
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const cupom = await this.service.getById(id);

    return CupomMapper.fromEntityToResponseDTO(cupom);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateCupomValidator) data: UpdateCupomDTO
  ) {
    const cupom = await this.service.updateById(id, {
      ...data
    });

    return CupomMapper.fromEntityToResponseDTO(cupom);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteById(id);
  }
}
