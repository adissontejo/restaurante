import { Injectable } from '@nestjs/common';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';
import { RCampoFormulario } from './resposta-campo-formulario.entity';
import { RCampoFormularioMapper } from './mapper/resposta-campo-formulario.mapper';
import { UpdateRCampoFormularioDTO } from './dto/update-campo-formulario.dto';
import { RCampoFormularioRepository } from './resposta-campo-formulario.repository';
import { CreateRCampoFormularioDTO } from './dto/create-resposta-campo-formulario.dto';

@Injectable()
export class RCampoFormularioService {
    constructor(
        private readonly repository: RCampoFormularioRepository,
    ) {}

    @Transaction()
    async create(data: CreateRCampoFormularioDTO): Promise<RCampoFormulario> {
        const createData = RCampoFormularioMapper.fromCreateDTOToEntity(data)

        console.log(createData)
        
        if (!data.resposta || !data.campo_formulario_id || !data.item_pedido_id) {
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
        const rcf = await this.repository.findByCampoFormularioId(campo_formulario_id);
    
        return rcf;
    }

    async getById(id: number) {
        const rcf = await this.repository.getById(id);
    
        if (!rcf) {
          throw new AppException(
            `Resposta campo formulario com id ${id} não encontrado`,
            ExceptionType.DATA_NOT_FOUND,
          );
        }
    
        return rcf;
    }

    @Transaction()
    async updateById(
        id: number,
        data: UpdateRCampoFormularioDTO
    ): Promise<RCampoFormulario> {
        const rcf = await this.getById(id);
        const updateData = RCampoFormularioMapper.fromUpdateDTOToEntity(data);
    
        await this.repository.updateById(rcf.id, updateData);

        removeUndefinedAndAssign(rcf, updateData);

        return {
            ...rcf
          };
    }

    @Transaction()
    async deleteById(id: number) {
        const rcf = await this.getById(id);

        await this.repository.deleteById(id);
    }
    
}
