import { Module } from "@nestjs/common";
import { RCampoFormularioService } from './resposta-campo-formulario.service';
import { RCampoFormularioController } from "./resposta-campo-formulario.controller";
import { RCampoFormularioRepository } from "./resposta-campo-formulario.repository";

@Module({
    providers: [RCampoFormularioService, RCampoFormularioRepository],
    controllers: [RCampoFormularioController]
})
export class RCampoFormularioModule {}
