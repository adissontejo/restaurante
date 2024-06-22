import { CreateRespostaCampoFormularioDTO } from 'src/modules/resposta-campo-formulario/dtos/create-resposta-campo-formulario.dto';

export interface CreateItemPedidoDTO {
  instanciaItemId: number;
  pedidoId: number;
  quantidade: number;
  observacao: string;
  respostas?: Omit<CreateRespostaCampoFormularioDTO, 'itemPedidoId'>[];
}
