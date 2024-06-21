import { Module } from "@nestjs/common";

import { CampoFormularioService } from "./campo_formulario.service";
import { CampoFormularioController } from "./campo_formulario.controller";
import { CampoFormularioRepository } from "./campo_formulario.repository";

@Module({
    providers: [CampoFormularioService, CampoFormularioRepository],
    controllers: [CampoFormularioController]
})
export class CampoFormularioModule {}
