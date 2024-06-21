import { CreateUsuarioDTO } from '../dtos/create-usuario.dto';
import { UpdateUsuarioDTO } from '../dtos/update-usuario.dto';
import { UsuarioResponseDTO } from '../dtos/usuario-response.dto';
import { Usuario } from '../usuario.entity';

export abstract class UsuarioMapper {
  static fromCreateDTOToEntity(data: CreateUsuarioDTO): Omit<Usuario, 'id'> {
    return {
      nome: data.nome,
      email: data.email,
      data_nascimento: data.dataNascimento,
      celular: data.celular,
      foto_perfil_url: data.fotoPerfilUrl,
    };
  }

  static fromUpdateDTOToEntity(
    data: UpdateUsuarioDTO,
  ): Omit<Partial<Usuario>, 'id'> {
    return {
      nome: data.nome,
      email: data.email,
      data_nascimento: data.dataNascimento,
      celular: data.celular,
      foto_perfil_url: data.fotoPerfilUrl,
    };
  }

  static fromEntityToResponseDTO(data: Usuario): UsuarioResponseDTO {
    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      dataNascimento: data.data_nascimento,
      celular: data.celular || null,
      fotoPerfilUrl: data.foto_perfil_url || null,
    };
  }
}
