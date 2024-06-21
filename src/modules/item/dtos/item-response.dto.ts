export interface ItemResponseDTO {
    id: number,
    nome: string,
    habilitado: boolean,
    restaurante_id: number,
    foto_item_url?: string;
}