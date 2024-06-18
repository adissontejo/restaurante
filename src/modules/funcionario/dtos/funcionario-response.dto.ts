import { UsuarioResponseDTO } from "src/modules/usuario/dtos/usuario-response.dto";

export interface FuncionarioResponseDTO {

    id: number;
    cargo: string;
    usuarioId: number;
    restauranteId: number;
    usuario: UsuarioResponseDTO;
}
