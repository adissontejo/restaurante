import { Injectable } from '@nestjs/common';
import { CepRepository } from './cep.repository';
import { getCep } from 'src/services/viacep';
import { Cep } from './cep.entity';

@Injectable()
export class CepService {
  constructor(private readonly cepRepository: CepRepository) {}

  async createIfNotExists(cepString: string) {
    const existingCep = await this.cepRepository.getByCep(cepString);

    if (existingCep) {
      return existingCep;
    }

    const { localidade, uf, bairro } = await getCep(cepString);

    const cep: Cep = {
      cep: cepString,
      cidade: localidade,
      estado: uf,
      bairro,
    };

    await this.cepRepository.insert(cep);

    return cep;
  }
}
