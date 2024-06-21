import { Injectable } from '@nestjs/common';
import { OpcaoRepository } from './opcao.repository';
import { CreateOpcaoDTO } from './dto/create-opcao.dto';
import { Opcao } from './opcao.entity';
import { OpcaoMapper } from './mapper/opcao.mapper';
import { UpdateOpcaoDTO } from './dto/update-opcao.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';

@Injectable()
export class OpcaoService {
    constructor(
        private readonly repository: OpcaoRepository,
    ) {}

    @Transaction()
    async create(data: CreateOpcaoDTO): Promise<Opcao> {
        const createData = OpcaoMapper.fromCreateDTOToEntity(data)

        console.log(createData)
        
        if (!data.texto || !data.campo_formulario_id ) {
            throw new AppException(
                `Todos os campos obrigatórios devem ser fornecidos`,
                ExceptionType.INVALID_PARAMS,
            )
        }

        const result = await this.repository.insert(createData);
        
        return {
            ...createData,
            id: result.insertId
        };
    }

    async list(campo_formulario_id: number) {
        const opcoes = await this.repository.findByCampoFormularioId(campo_formulario_id);
    
        return opcoes;
    }

    async getById(id: number) {
        const opcao = await this.repository.getById(id);
    
        if (!opcao) {
          throw new AppException(
            `Opcao com id ${id} não encontrado`,
            ExceptionType.DATA_NOT_FOUND,
          );
        }
    
        return opcao;
    }

    @Transaction()
    async updateById(
        id: number,
        data: UpdateOpcaoDTO
    ): Promise<Opcao> {
        const opcao = await this.getById(id);
        const updateData = OpcaoMapper.fromUpdateDTOToEntity(data);
    
        await this.repository.updateById(opcao.id, updateData);

        removeUndefinedAndAssign(opcao, updateData);

        return {
            ...opcao
          };
    }

    @Transaction()
    async deleteById(id: number) {
        const opcao = await this.getById(id);

        await this.repository.deleteById(id);
    }
    
}
