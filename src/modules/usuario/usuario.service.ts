import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { StorageService } from 'src/storage/storage.service';
import { CreateUsuarioDTO } from './dtos/create-usuario.dto';
import { Usuario } from './usuario.entity';
import { UsuarioMapper } from './mappers/usuario.mapper';
import { UpdateUsuarioDTO } from './dtos/update-usuario.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';

@Injectable()
export class UsuarioService {
  constructor(private readonly repository: UsuarioRepository,
        private readonly storageService: StorageService
  ) {}

  @Transaction()
  async create(data: CreateUsuarioDTO): Promise<Usuario> {

    const createData = UsuarioMapper.fromCreateDTOToEntity(data);

    if (!data.nome || !data.email || !data.dataNascimento) {
        throw new AppException(
          `Todos os campos obrigatórios devem ser fornecidos`,
          ExceptionType.INVALID_PARAMS,
        );
    }

    this.checkExistingEmail(data.email);

    if (data.fotoPerfilUrl) {
      createData.foto_perfil_url = await this.storageService.uploadFile(data.fotoPerfilUrl);
    }

    const result = await this.repository.insert(createData);
    return {
      ...createData,
      id: result.insertId
    };
  }

  async list() {
    const usuarios = await this.repository.findAll();

    return usuarios;
  }

  async getById(id: number) {
    const usuario = await this.repository.getById(id);

    if (!usuario) {
      throw new AppException(
        `Usuário com id ${id} não encontrado`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return usuario;
  }

  @Transaction()
  async updateById(
    id: number,
    data: UpdateUsuarioDTO,
  ): Promise<Usuario> {
    const usuario = await this.getById(id);
    const updateData = UsuarioMapper.fromUpdateDTOToEntity(data);

    if (data.fotoPerfilUrl) {
      if (usuario.foto_perfil_url) {
        await this.storageService.deleteFile(usuario.foto_perfil_url);
      }

      updateData.foto_perfil_url = await this.storageService.uploadFile(data.fotoPerfilUrl);
    }


    removeUndefinedAndAssign(usuario, updateData);

    return {
      ...usuario
    };
  }

  @Transaction()
  async deleteById(id: number) {
    const usuario = await this.getById(id);

    if (usuario.foto_perfil_url) {
      await this.storageService.deleteFile(usuario.foto_perfil_url);
    }

    await this.repository.deleteById(id);
  }

  private async checkExistingEmail(email: string) {
    const existingEmail = await this.repository.getByEmail(email);

    if (existingEmail) {
      throw new AppException(
        `Usuário já existente com o email ${email}!`,
        ExceptionType.DATA_ALREADY_EXISTS,
      );
    }
  }
}
