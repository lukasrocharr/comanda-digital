-- V3__fornecedores_produtos.sql

CREATE TABLE IF NOT EXISTS fornecedores (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  razao_social VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  telefone VARCHAR(50),
  email VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE IF NOT EXISTS ingredientes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sku VARCHAR(255) NOT NULL UNIQUE,
  unidade VARCHAR(255) NOT NULL,
  saldo_atual NUMERIC(10,4) NOT NULL DEFAULT 0,
  estoque_minimo NUMERIC(10,4) NOT NULL,
  custo_unitario NUMERIC(10,4) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'OK'
);

CREATE TABLE IF NOT EXISTS fornecedor_produtos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  fornecedor_id BIGINT NOT NULL REFERENCES fornecedores(id) ON DELETE CASCADE,
  ingrediente_id BIGINT NOT NULL REFERENCES ingredientes(id),
  preco NUMERIC(10,2) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fornecedor_produto_ingrediente
  ON fornecedor_produtos(fornecedor_id, ingrediente_id);

CREATE TABLE IF NOT EXISTS fichas_tecnicas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  prato_id BIGINT NOT NULL UNIQUE REFERENCES pratos(id),
  rendimento INTEGER NOT NULL DEFAULT 1,
  tempo_preparo INTEGER,
  modo_preparo TEXT
);

CREATE TABLE IF NOT EXISTS fichas_tecnicas_itens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ficha_tecnica_id BIGINT NOT NULL REFERENCES fichas_tecnicas(id),
  ingrediente_id BIGINT NOT NULL REFERENCES ingredientes(id),
  quantidade NUMERIC(10,4) NOT NULL,
  fator_correcao NUMERIC(10,4) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pedidos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cliente_id BIGINT NOT NULL REFERENCES usuarios(id),
  status VARCHAR(50) NOT NULL DEFAULT 'RECEBIDO',
  total NUMERIC(10,2) NOT NULL,
  endereco TEXT,
  criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedidos_itens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT NOT NULL REFERENCES pedidos(id),
  prato_id BIGINT NOT NULL REFERENCES pratos(id),
  quantidade INTEGER NOT NULL,
  obs TEXT,
  preco_unitario NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos_compra (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  fornecedor_id BIGINT NOT NULL REFERENCES fornecedores(id),
  status VARCHAR(50) NOT NULL DEFAULT 'RASCUNHO',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedidos_compra_itens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_compra_id BIGINT NOT NULL REFERENCES pedidos_compra(id),
  ingrediente_id BIGINT NOT NULL REFERENCES ingredientes(id),
  quantidade NUMERIC(10,4) NOT NULL,
  preco_unitario NUMERIC(10,4) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ingrediente_id BIGINT NOT NULL REFERENCES ingredientes(id),
  tipo VARCHAR(255) NOT NULL,
  quantidade NUMERIC(10,4) NOT NULL,
  motivo VARCHAR(255) NOT NULL,
  referencia VARCHAR(255),
  usuario_id BIGINT REFERENCES usuarios(id),
  criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
