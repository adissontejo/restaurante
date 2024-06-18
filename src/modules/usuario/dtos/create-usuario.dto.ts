export interface CreateUsuarioDTO {
    nome: string;
    email: string;
    dataNascimento: string;
    fotoPerfilUrl?: Express.Multer.File;
    celular?: string;
}
