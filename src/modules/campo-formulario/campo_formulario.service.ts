import { Injectable } from '@nestjs/common';
import { CampoFormularioRepository } from './campo_formulario.repository';
import { CreateCampoFormularioDTO } from './dto/create-campo_formulario.dto';
import { CampoFormulario } from './campo_formulario.entity';
import { UpdateCampoFormularioDTO } from './dto/update-campo_formulario.dto';
import { CampoFormularioMapper } from './mapper/campo_formulario.mapper';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';

@Injectable()
export class CampoFormularioService {
    constructor(
        private readonly repository: CampoFormularioRepository,
    ) {}

    @Transaction()
    async create(data: CreateCampoFormularioDTO): Promise<CampoFormulario> {
        const createData = CampoFormularioMapper.fromCreateDTOToEntity(data)

        console.log(createData)
        
        if (!data.nome || !data.tipo_campo || !data.qt_min_opcoes
            || !data.qt_max_opcoes || !data.item_id
        ) {
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

    async list(item_id: number) {
        const cfs = await this.repository.findByItemId(item_id);
    
        return cfs;
    }

    async getById(id: number) {
        const cf = await this.repository.getById(id);
    
        if (!cf) {
          throw new AppException(
            `Campo Formulario com id ${id} não encontrado`,
            ExceptionType.DATA_NOT_FOUND,
          );
        }
    
        return cf;
    }

    @Transaction()
    async updateById(
        id: number,
        data: UpdateCampoFormularioDTO
    ): Promise<CampoFormulario> {
        const cf = await this.getById(id);
        const updateData = CampoFormularioMapper.fromUpdateDTOToEntity(data);
    
        await this.repository.updateById(cf.id, updateData);

        removeUndefinedAndAssign(cf, updateData);

        return {
            ...cf
          };
    }

    @Transaction()
    async deleteById(id: number) {
        const cf = await this.getById(id);

        await this.repository.deleteById(id);
    }
    
}
