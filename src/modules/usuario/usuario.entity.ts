export interface Usuario {
  id: number;
  nome: string;
  email: string;
  data_nascimento: string;
  foto_perfil_url?: string;
  celular?: string;
}
