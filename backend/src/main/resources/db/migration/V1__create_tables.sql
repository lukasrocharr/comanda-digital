-- V1__create_tables.sql
-- Cria as tabelas iniciais: usuarios, categorias, pratos (compatível com entidades Java)

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(50) NOT NULL,
  telefone VARCHAR(50),
  endereco TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'ATIVO',
  criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categorias (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT,
  ordem INTEGER,
  status VARCHAR(50) NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE IF NOT EXISTS pratos (
  id BIGSERIAL PRIMARY KEY,
  categoria_id BIGINT REFERENCES categorias(id) ON DELETE SET NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  emoji VARCHAR(50),
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  custo NUMERIC(10,4),
  tempo_preparo INTEGER,
  status VARCHAR(50) NOT NULL DEFAULT 'ATIVO'
);
