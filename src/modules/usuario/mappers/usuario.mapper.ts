import { CreateUsuarioDTO } from '../dtos/create-usuario.dto';
import { UpdateUsuarioDTO } from '../dtos/update-usuario.dto';
import { UsuarioResponseDTO } from '../dtos/usuario-response.dto';
import { Usuario } from '../usuario.entity';

export abstract class UsuarioMapper {
  static fromCreateDTOToEntity(data: CreateUsuarioDTO): Omit<Usuario, 'id'> {
    return {
      nome: data.nome,
      email: data.email,
      foto_perfil_url: data.fotoPerfilUrl,
    };
  }

  static fromUpdateDTOToEntity(
    data: UpdateUsuarioDTO,
  ): Omit<Partial<Usuario>, 'id'> {
    return {
      nome: data.nome,
      foto_perfil_url: data.fotoPerfilUrl,
    };
  }

  static fromEntityToResponseDTO(data: Usuario): UsuarioResponseDTO {
    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      fotoPerfilUrl: data.foto_perfil_url || null,
    };
  }
}
