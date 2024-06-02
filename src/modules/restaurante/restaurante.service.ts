import { Injectable } from '@nestjs/common';
import { CreateRestauranteDTO } from './dtos/create-restaurante.dto';
import { RestauranteRepository } from './restaurante.repository';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Cep } from '../cep/cep.entity';
import { CepService } from '../cep/cep.service';
import { UpdateRestauranteDTO } from './dtos/update-restaurate.dto';
import { Transaction } from 'src/decorators/transaction.decorator';

export interface CepRow {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
}

export interface RestauranteRow {
  id: string;
  nome: string;
  rua: string;
  numero: number;
  cep: string;
  complemento?: string;
  dominio: string;
  logo_url?: string;
  qt_pedidos_fidelidade?: number;
  valor_fidelidade?: number;
}

@Injectable()
export class RestauranteService {
  constructor(
    private readonly repository: RestauranteRepository,
    private readonly cepService: CepService,
  ) {}

  @Transaction()
  async create(data: CreateRestauranteDTO) {
    await this.checkExistingDominio(data.dominio);

    const cep = await this.cepService.createIfNotExists(data.cep);

    const result = await this.repository.insert({
      ...data,
      cep,
    });

    return {
      ...data,
      cep,
      id: result.insertId,
    };
  }

  async list() {
    const restaurantes = await this.repository.getAll();

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
  async updateById(id: number, data: UpdateRestauranteDTO) {
    const restaurante = await this.getById(id);

    if (data.dominio && data.dominio !== restaurante.dominio) {
      await this.checkExistingDominio(data.dominio);
    }

    let cep: Cep | undefined = undefined;

    if (data.cep && data.cep !== restaurante.cep.cep) {
      cep = await this.cepService.createIfNotExists(data.cep);
    }

    await this.repository.updateById(restaurante.id, {
      ...data,
      cep,
    });

    return {
      ...restaurante,
      ...data,
      cep: cep || restaurante.cep,
    };
  }

  async deleteById(id: number) {
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
