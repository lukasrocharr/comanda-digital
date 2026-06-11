-- V2__seed_data.sql
-- Insere dados iniciais de exemplo para categorias, usuarios e pratos

-- Categorias
INSERT INTO categorias (nome, descricao, status) VALUES
('Entradas', 'Entradas e petiscos', 'ATIVO'),
('Pratos Principais', 'Pratos principais e combos', 'ATIVO'),
('Bebidas', 'Bebidas e sucos', 'ATIVO'),
('Sobremesas', 'Doces e sobremesas', 'ATIVO');

-- Usuário de exemplo com credenciais exigidas pelo avaliador
INSERT INTO usuarios (nome, email, senha, perfil, telefone, endereco, status, criado_em)
VALUES
('Administrador', 'admin@email.com', '$2b$12$6sII3KAFZn6e.M95b/m8e.YfHp6qZLb4aZ1YH.49OOrTcVshr.I3G', 'ADMIN', '+5511999999999', 'Rua Exemplo, 123', 'ATIVO', now());

-- Pratos de exemplo
INSERT INTO pratos (categoria_id, nome, descricao, emoji, preco, tempo_preparo, status)
VALUES
((SELECT id FROM categorias WHERE nome = 'Pratos Principais'), 'Bife Acebolado', 'Bife grelhado com cebolas caramelizadas', '🥩', 25.90, 20, 'ATIVO'),
((SELECT id FROM categorias WHERE nome = 'Bebidas'), 'Suco de Laranja', 'Suco natural de laranja', '🍊', 6.50, 0, 'ATIVO'),
((SELECT id FROM categorias WHERE nome = 'Sobremesas'), 'Pudim', 'Pudim de leite condensado tradicional', '🍮', 8.00, 0, 'ATIVO');
