import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CupomService } from './cupom.service';
import { CupomMapper } from './mappers/cupom.mapper';

@Controller('/cupons')
export class CupomController {
  constructor(private readonly service: CupomService) {}

  @Get()
  async list(
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('restauranteId', ParseIntPipe) restauranteId: number,
  ) {
    const cupons = await this.service.getByUsuarioAndRestaurante(
      usuarioId,
      restauranteId,
    );

    return cupons.map(CupomMapper.fromEntityToResponseDTO);
  }
}
