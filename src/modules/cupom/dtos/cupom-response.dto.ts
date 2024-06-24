export interface CupomResponseDTO {
  id: number;
  desconto: number;
  usuarioId: number;
  restauranteId: number;
  qtPedidosFeitos: number;
  qtPedidosTotal: number;
}
