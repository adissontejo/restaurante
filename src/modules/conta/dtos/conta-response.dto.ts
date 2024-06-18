import { UsuarioResponseDTO } from "src/modules/usuario/dtos/usuario-response.dto";

export interface ContaResponseDTO {
    id: number;
    mes: number;
    valorTotal: number;
    valorPago: number;
    usuarioId: number;
    restauranteId: number;
    usuario: UsuarioResponseDTO;
}
