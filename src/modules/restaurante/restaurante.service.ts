import { Injectable } from '@nestjs/common';
import { CreateRestauranteDTO } from './dtos/create-restaurante.dto';
import { RestauranteRepository } from './restaurante.repository';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { CepService } from '../cep/cep.service';
import { UpdateRestauranteDTO } from './dtos/update-restaurate.dto';
import { Transaction } from 'src/decorators/transaction.decorator';
import { HorarioRestauranteService } from '../horario-restaurante/horario-restaurante.service';
import { RestauranteMapper } from './mappers/restaurante.mapper';
import { RestauranteWithRelations } from './restaurante.entity';

@Injectable()
export class RestauranteService {
  constructor(
    private readonly repository: RestauranteRepository,
    private readonly cepService: CepService,
    private readonly horariosRestauranteService: HorarioRestauranteService,
  ) {}

  @Transaction()
  async create(data: CreateRestauranteDTO): Promise<RestauranteWithRelations> {
    await this.checkExistingDominio(data.dominio);

    const createData = RestauranteMapper.fromCreateDTOToEntity(data);
    const cep = await this.cepService.createIfNotExists(data.cep);
    const result = await this.repository.insert(createData);

    const horarios =
      await this.horariosRestauranteService.unsafeSetHorariosForRestaurante(
        result.insertId,
        data.horarios,
      );

    return {
      ...createData,
      id: result.insertId,
      cep,
      horarios,
    };
  }

  async list() {
    const restaurantes = await this.repository.findAll();

    return restaurantes;
  }

  async getById(id: number) {
    const restaurante = await this.repository.getById(id);

    if (!restaurante) {
      throw new AppException(
        `Restaurante com id ${id} não encontrado`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return restaurante;
  }

  async getByDominio(dominio: string) {
    const restaurante = await this.repository.getByDominio(dominio);

    if (!restaurante) {
      throw new AppException(
        `Restaurante com domínio ${dominio} não encontrado`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return restaurante;
  }

  @Transaction()
  async updateById(
    id: number,
    data: UpdateRestauranteDTO,
  ): Promise<RestauranteWithRelations> {
    const restaurante = await this.getById(id);
    const updateData = RestauranteMapper.fromUpdateDTOToEntity(data);

    if (data.dominio && data.dominio !== restaurante.dominio) {
      await this.checkExistingDominio(data.dominio);
    }

    let cep = restaurante.cep;

    if (data.cep && data.cep !== restaurante.cep.cep) {
      cep = await this.cepService.createIfNotExists(data.cep);
    }

    await this.repository.updateById(restaurante.id, updateData);

    let horarios = restaurante.horarios;

    if (data.horarios) {
      horarios =
        await this.horariosRestauranteService.unsafeSetHorariosForRestaurante(
          id,
          data.horarios,
        );
    }

    return {
      ...restaurante,
      ...updateData,
      cep,
      horarios,
    };
  }

  @Transaction()
  async deleteById(id: number) {
    await this.horariosRestauranteService.deleteHorariosFromRestaurante(id);

    await this.repository.deleteById(id);
  }

  private async checkExistingDominio(dominio: string) {
    const existingDominio = await this.repository.getByDominio(dominio);

    if (existingDominio) {
      throw new AppException(
        `Restaurante já existente com o domínio ${dominio}!`,
        ExceptionType.DATA_ALREADY_EXISTS,
      );
    }
  }
}
