import { UsuarioResponseDTO } from "src/modules/usuario/dtos/usuario-response.dto";

export interface CupomResponseDTO {

    id: number;
    desconto: number;
    usuarioId: number;
    restauranteId: number;
    usuario: UsuarioResponseDTO;
}
