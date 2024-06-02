import { Module } from '@nestjs/common';
import { CepRepository } from './cep.repository';
import { CepService } from './cep.service';

@Module({
  providers: [CepRepository, CepService],
  exports: [CepService],
})
export class CepModule {}
