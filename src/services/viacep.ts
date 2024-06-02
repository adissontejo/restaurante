import axios from 'axios';

const viacepApi = axios.create({
  baseURL: 'https://viacep.com.br/',
});

export interface ViacepCepResponse {
  localidade: string;
  bairro: string;
  uf: string;
}

export const getCep = async (cep: string) => {
  const response = await viacepApi.get<ViacepCepResponse>(`/ws/${cep}/json`);

  return response.data;
};
