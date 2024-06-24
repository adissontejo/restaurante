-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema restaurante
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema restaurante
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `restaurante` ;
USE `restaurante` ;

-- -----------------------------------------------------
-- Table `restaurante`.`cep`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`cep` (
  `cep` CHAR(8) NOT NULL,
  `bairro` VARCHAR(80) NOT NULL,
  `cidade` VARCHAR(80) NOT NULL,
  `estado` CHAR(2) NOT NULL,
  PRIMARY KEY (`cep`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`restaurante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`restaurante` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `rua` VARCHAR(100) NOT NULL,
  `numero` INT NOT NULL,
  `cep` CHAR(8) NOT NULL,
  `complemento` VARCHAR(100) NULL,
  `dominio` VARCHAR(20) NOT NULL,
  `logo_url` VARCHAR(200) NULL,
  `qt_pedidos_fidelidade` INT NULL,
  `valor_fidelidade` FLOAT NULL,
  `descricao` VARCHAR(4000) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_restaurante_1_idx` (`cep` ASC) VISIBLE,
  UNIQUE INDEX `dominio_UNIQUE` (`dominio` ASC) VISIBLE,
  CONSTRAINT `fk_RESTAURANTES_CEP`
    FOREIGN KEY (`cep`)
    REFERENCES `restaurante`.`cep` (`cep`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`horario_restaurante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`horario_restaurante` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dia_semana` ENUM('dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab') NOT NULL,
  `abertura` TIME NOT NULL,
  `fechamento` TIME NOT NULL,
  `restaurante_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_HORARIOS_RESTAURANTE_RESTAURANTE`
    FOREIGN KEY (`restaurante_id`)
    REFERENCES `restaurante`.`restaurante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `foto_perfil_url` VARCHAR(200) NULL,
  `celular` VARCHAR(20) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`funcionario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cargo` ENUM('garcom', 'cozinheiro', 'dono', 'admin') NOT NULL,
  `usuario_id` INT NOT NULL,
  `restaurante_id` INT NOT NULL,
  INDEX `fk_funcionario_restaurante1_idx` (`restaurante_id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_usuario_restaurante` (`restaurante_id` ASC, `usuario_id` ASC) INVISIBLE,
  CONSTRAINT `fk_funcionario_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `restaurante`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_funcionario_restaurante1`
    FOREIGN KEY (`restaurante_id`)
    REFERENCES `restaurante`.`restaurante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`categoria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `restaurante_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_categoria_restaurante1_idx` (`restaurante_id` ASC) VISIBLE,
  CONSTRAINT `fk_categoria_restaurante1`
    FOREIGN KEY (`restaurante_id`)
    REFERENCES `restaurante`.`restaurante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `habilitado` TINYINT NOT NULL,
  `foto_url` VARCHAR(200) NULL,
  `categoria_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_item_categoria1_idx` (`categoria_id` ASC) VISIBLE,
  CONSTRAINT `fk_item_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `restaurante`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`campo_formulario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`campo_formulario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `tipo_campo` ENUM('input', 'select') NOT NULL,
  `qt_min_opcoes` INT NULL,
  `qt_max_opcoes` INT NULL,
  `item_id` INT NOT NULL,
  `deletado` TINYINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_campo_formulario_item1_idx` (`item_id` ASC) VISIBLE,
  CONSTRAINT `fk_campo_formulario_item1`
    FOREIGN KEY (`item_id`)
    REFERENCES `restaurante`.`item` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`opcao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`opcao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `texto` VARCHAR(100) NOT NULL,
  `campo_formulario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_opcao_campo_formulario1_idx` (`campo_formulario_id` ASC) VISIBLE,
  CONSTRAINT `fk_opcao_campo_formulario1`
    FOREIGN KEY (`campo_formulario_id`)
    REFERENCES `restaurante`.`campo_formulario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`instancia_item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`instancia_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `preco` FLOAT NOT NULL,
  `ativa` TINYINT NOT NULL,
  `item_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_instancia_prato_item1_idx` (`item_id` ASC) VISIBLE,
  CONSTRAINT `fk_instancia_prato_item1`
    FOREIGN KEY (`item_id`)
    REFERENCES `restaurante`.`item` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`cupom`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`cupom` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `desconto` FLOAT NOT NULL,
  `usuario_id` INT NOT NULL,
  `restaurante_id` INT NOT NULL,
  `qt_pedidos_feitos` INT NOT NULL,
  `qt_pedidos_total` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_cupom_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_cupom_restaurante1_idx` (`restaurante_id` ASC) VISIBLE,
  CONSTRAINT `fk_cupom_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `restaurante`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cupom_restaurante1`
    FOREIGN KEY (`restaurante_id`)
    REFERENCES `restaurante`.`restaurante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`pedido` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data_hora` DATETIME NOT NULL,
  `numero_mesa` INT NOT NULL,
  `observacao` VARCHAR(400) NULL,
  `nota_avaliacao` INT NULL,
  `observacao_avaliacao` VARCHAR(400) NULL,
  `usuario_id` INT NULL,
  `funcionario_responsavel_id` INT NULL,
  `restaurante_id` INT NOT NULL,
  `iniciado` TINYINT NOT NULL,
  `cupom_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_pedido_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_pedido_restaurante1_idx` (`restaurante_id` ASC) VISIBLE,
  INDEX `fk_pedido_funcionario1_idx` (`funcionario_responsavel_id` ASC) VISIBLE,
  INDEX `fk_pedido_cupom1_idx` (`cupom_id` ASC) VISIBLE,
  CONSTRAINT `fk_pedido_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `restaurante`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_restaurante1`
    FOREIGN KEY (`restaurante_id`)
    REFERENCES `restaurante`.`restaurante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_funcionario1`
    FOREIGN KEY (`funcionario_responsavel_id`)
    REFERENCES `restaurante`.`funcionario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_cupom1`
    FOREIGN KEY (`cupom_id`)
    REFERENCES `restaurante`.`cupom` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`item_pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`item_pedido` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `quantidade` INT NOT NULL,
  `observacao` VARCHAR(400) NULL,
  `pedido_id` INT NOT NULL,
  `instancia_item_id` INT NOT NULL,
  `status` ENUM('preparando', 'finalizado', 'cancelado') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_prato_pedido_pedido1_idx` (`pedido_id` ASC) VISIBLE,
  INDEX `fk_prato_pedido_instancia_item1_idx` (`instancia_item_id` ASC) VISIBLE,
  CONSTRAINT `fk_prato_pedido_pedido1`
    FOREIGN KEY (`pedido_id`)
    REFERENCES `restaurante`.`pedido` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_prato_pedido_instancia_item1`
    FOREIGN KEY (`instancia_item_id`)
    REFERENCES `restaurante`.`instancia_item` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`resposta_campo_formulario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`resposta_campo_formulario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `resposta` VARCHAR(400) NULL,
  `campo_formulario_id` INT NOT NULL,
  `item_pedido_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_resposta_campo_formulario_campo_formulario1_idx` (`campo_formulario_id` ASC) VISIBLE,
  INDEX `fk_resposta_campo_formulario_item_pedido1_idx` (`item_pedido_id` ASC) VISIBLE,
  UNIQUE INDEX `uq_campo_formulario_item_pedido` (`campo_formulario_id` ASC, `item_pedido_id` ASC) VISIBLE,
  CONSTRAINT `fk_resposta_campo_formulario_campo_formulario1`
    FOREIGN KEY (`campo_formulario_id`)
    REFERENCES `restaurante`.`campo_formulario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_resposta_campo_formulario_item_pedido1`
    FOREIGN KEY (`item_pedido_id`)
    REFERENCES `restaurante`.`item_pedido` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`opcao_selecionada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`opcao_selecionada` (
  `resposta_campo_formulario_id` INT NOT NULL,
  `opcao_id` INT NOT NULL,
  INDEX `fk_opcao_selecionada_resposta_campo_formulario1_idx` (`resposta_campo_formulario_id` ASC) VISIBLE,
  INDEX `fk_opcao_selecionada_opcao1_idx` (`opcao_id` ASC) VISIBLE,
  UNIQUE INDEX `uq_resposta_campo_formulario_opcao` (`resposta_campo_formulario_id` ASC, `opcao_id` ASC) VISIBLE,
  PRIMARY KEY (`resposta_campo_formulario_id`, `opcao_id`),
  CONSTRAINT `fk_opcao_selecionada_resposta_campo_formulario1`
    FOREIGN KEY (`resposta_campo_formulario_id`)
    REFERENCES `restaurante`.`resposta_campo_formulario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_opcao_selecionada_opcao1`
    FOREIGN KEY (`opcao_id`)
    REFERENCES `restaurante`.`opcao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurante`.`conta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurante`.`conta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mes` INT NOT NULL,
  `valor_total` FLOAT NOT NULL,
  `valor_pago` FLOAT NOT NULL,
  `usuario_id` INT NOT NULL,
  `restaurante_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_conta_restaurante1_idx` (`restaurante_id` ASC) VISIBLE,
  INDEX `fk_conta_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_conta_restaurante1`
    FOREIGN KEY (`restaurante_id`)
    REFERENCES `restaurante`.`restaurante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_conta_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `restaurante`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
