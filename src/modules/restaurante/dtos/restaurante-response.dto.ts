export interface RestauranteResponseDTO {
  id: number;
  nome: string;
  rua: string;
  numero: number;
  cep: string;
  complemento?: string;
  dominio: string;
  bairro: string;
  cidade: string;
  estado: string;
}
