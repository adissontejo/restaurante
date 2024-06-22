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
  constructor(
    private readonly repository: UsuarioRepository,
    private readonly storageService: StorageService,
  ) {}

  private async unsafeCreate(data: CreateUsuarioDTO) {
    const createData = UsuarioMapper.fromCreateDTOToEntity(data);

    if (!data.nome || !data.email || !data.dataNascimento) {
      throw new AppException(
        `Todos os campos obrigatórios devem ser fornecidos`,
        ExceptionType.INVALID_PARAMS,
      );
    }

    if (data.fotoPerfil) {
      createData.foto_perfil_url = await this.storageService.uploadFile(
        data.fotoPerfil,
      );
    }

    const result = await this.repository.insert(createData);
    return {
      ...createData,
      id: result.insertId,
    };
  }

  @Transaction()
  async createIfNotExists(data: CreateUsuarioDTO): Promise<Usuario> {
    const existing = await this.repository.getByEmail(data.email);

    if (existing) {
      return existing;
    }

    return this.unsafeCreate(data);
  }

  @Transaction()
  async create(data: CreateUsuarioDTO): Promise<Usuario> {
    await this.checkExistingEmail(data.email);

    return this.unsafeCreate(data);
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

  async getByEmail(email: string) {
    const usuario = await this.repository.getByEmail(email);

    if (!usuario) {
      throw new AppException(
        `Usuário com email ${email} não encontrado`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return usuario;
  }

  async getFuncionarioByEmail(email: string, restauranteId: number) {
    const data = await this.repository.getWithFuncionarioByEmailAndRestaurante(
      email,
      restauranteId,
    );

    if (!data) {
      throw new AppException(
        `Usuário com email ${email} não encontrado`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return data;
  }

  @Transaction()
  async updateById(id: number, data: UpdateUsuarioDTO): Promise<Usuario> {
    const usuario = await this.getById(id);
    const updateData = UsuarioMapper.fromUpdateDTOToEntity(data);

    if (data.fotoPerfil) {
      if (usuario.foto_perfil_url) {
        await this.storageService.deleteFile(usuario.foto_perfil_url);
      }

      updateData.foto_perfil_url = await this.storageService.uploadFile(
        data.fotoPerfil,
      );
    }

    await this.repository.updateById(usuario.id, updateData);

    removeUndefinedAndAssign(usuario, updateData);

    return {
      ...usuario,
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
