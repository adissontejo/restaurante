export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  fotoPerfil?: Express.Multer.File;
  fotoPerfilUrl?: string;
}
