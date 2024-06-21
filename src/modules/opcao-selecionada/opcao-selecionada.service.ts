import { Injectable } from '@nestjs/common';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';
import { OpSelecionadaRepository } from './opcao-selecionada.repository';
import { CreateOpSelecionadaDTO } from './dto/create-opcao-selecionada.dto';
import { OpSelecionada } from './opcao-selecionada.entity';
import { OpSelecionadaMapper } from './mapper/opcao-selecionada.mapper';
import { UpdateOpSelecionadaDTO } from './dto/update-opcao-selecionada.dto';

@Injectable()
export class OpSelecionadaService {
    constructor(
        private readonly repository: OpSelecionadaRepository,
    ) {}

    @Transaction()
    async create(data: CreateOpSelecionadaDTO): Promise<OpSelecionada> {
        const createData = OpSelecionadaMapper.fromCreateDTOToEntity(data)

        console.log(createData)
        
        if (!data.resposta_campo_formulario_id || !data.opcao_id ) {
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

    async list(resposta_campo_formulario_id: number) {
        const ops = await this.repository.findByRespostaCampoFormularioId(resposta_campo_formulario_id);
    
        return ops;
    }

    async getById(id: number) {
        const ops = await this.repository.getById(id);
    
        if (!ops) {
          throw new AppException(
            `Opção Selecionada com id ${id} não encontrado`,
            ExceptionType.DATA_NOT_FOUND,
          );
        }
    
        return ops;
    }

    @Transaction()
    async updateById(
        id: number,
        data: UpdateOpSelecionadaDTO
    ): Promise<OpSelecionada> {
        const ops = await this.getById(id);
        const updateData = OpSelecionadaMapper.fromUpdateDTOToEntity(data);
    
        await this.repository.updateById(ops.id, updateData);

        removeUndefinedAndAssign(ops, updateData);

        return {
            ...ops
          };
    }

    @Transaction()
    async deleteById(id: number) {
        const ops = await this.getById(id);

        await this.repository.deleteById(id);
    }
    
}
