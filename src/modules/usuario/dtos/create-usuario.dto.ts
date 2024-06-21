export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  dataNascimento: string;
  fotoPerfil?: Express.Multer.File;
  fotoPerfilUrl?: string;
  celular?: string;
}
