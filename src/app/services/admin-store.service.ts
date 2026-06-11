import { Injectable } from '@angular/core';

export interface Identificavel { id: number; }

export interface AdminCategoria extends Identificavel { emoji: string; nome: string; descricao: string; ordem: number; status: string; }
export interface AdminPrato extends Identificavel { nome: string; desc: string; cat: string; preco: number; custo: number; fcPct: number; status: string; }
export interface AdminIngrediente extends Identificavel { nome: string; sku: string; un: string; saldo: number; min: number; custo: number; }
export interface AdminMovimentacao extends Identificavel { data: string; ingrediente: string; tipo: string; qtd: number; motivo: string; referencia: string; usuario: string; }
export interface AdminFornecedor extends Identificavel { razaoSocial: string; cnpj: string; telefone: string; email: string; status: string; }
export interface AdminCompra extends Identificavel { numero: string; fornecedor: string; data: string; itens: number; total: number; status: string; }
export interface AdminUsuario extends Identificavel { nome: string; email: string; perfil: string; status: string; criadoEm: string; }

/** Acesso CRUD a uma coleção persistida em localStorage. */
export class Collection<T extends Identificavel> {
  constructor(private key: string, private seed: T[]) {}

  list(): T[] {
    const raw = localStorage.getItem(this.key);
    if (raw) {
      try { return JSON.parse(raw) as T[]; } catch { /* recria a partir do seed */ }
    }
    const copy = JSON.parse(JSON.stringify(this.seed)) as T[];
    this.persist(copy);
    return copy;
  }

  save(item: T): T {
    const list = this.list();
    if (item.id) {
      const idx = list.findIndex(x => x.id === item.id);
      if (idx >= 0) list[idx] = item; else list.push(item);
    } else {
      item.id = list.reduce((max, x) => Math.max(max, x.id), 0) + 1;
      list.push(item);
    }
    this.persist(list);
    return item;
  }

  remove(id: number): void {
    this.persist(this.list().filter(x => x.id !== id));
  }

  private persist(list: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}

@Injectable({ providedIn: 'root' })
export class AdminStore {
  readonly categorias = new Collection<AdminCategoria>('comanda-admin-categorias', [
    { id: 1, emoji: '🍔', nome: 'Lanches',    descricao: 'Hambúrgueres e sanduíches',     ordem: 1, status: 'ATIVO' },
    { id: 2, emoji: '🍦', nome: 'Açaí',       descricao: 'Bowls e tigelas',               ordem: 2, status: 'ATIVO' },
    { id: 3, emoji: '🍣', nome: 'Asiáticos',  descricao: 'Bowls e wraps asiáticos',       ordem: 3, status: 'ATIVO' },
    { id: 4, emoji: '🌮', nome: 'Wraps',      descricao: 'Wraps crocantes',               ordem: 4, status: 'ATIVO' },
    { id: 5, emoji: '🥤', nome: 'Bebidas',    descricao: 'Sucos, limonadas e refrigerantes', ordem: 5, status: 'ATIVO' },
  ]);

  readonly pratos = new Collection<AdminPrato>('comanda-admin-pratos', [
    { id: 1, nome: 'Burger Artesanal', desc: '180g blend + brioche',  cat: 'Lanches',   preco: 39.90, custo: 15.30, fcPct: 38.3, status: 'ATIVO' },
    { id: 2, nome: 'Açaí 500ml',       desc: 'Com granola e banana',  cat: 'Açaí',      preco: 22.90, custo: 5.80,  fcPct: 25.3, status: 'ATIVO' },
    { id: 3, nome: 'Bowl Asiático',    desc: 'Salmão, arroz, edamame', cat: 'Asiáticos', preco: 32.90, custo: 10.80, fcPct: 32.8, status: 'ATIVO' },
    { id: 4, nome: 'Wrap Crocante',    desc: 'Frango crocante',       cat: 'Wraps',     preco: 28.90, custo: 8.40,  fcPct: 29.1, status: 'PAUSADO' },
  ]);

  readonly ingredientes = new Collection<AdminIngrediente>('comanda-admin-ingredientes', [
    { id: 1, nome: 'Blend Bovino',   sku: 'ING-001', un: 'g',  saldo: 480,  min: 1000, custo: 0.045 },
    { id: 2, nome: 'Pão Brioche',    sku: 'ING-002', un: 'un', saldo: 43,   min: 10,   custo: 2.80 },
    { id: 3, nome: 'Queijo Cheddar', sku: 'ING-003', un: 'g',  saldo: 340,  min: 500,  custo: 0.065 },
    { id: 4, nome: 'Abacate',        sku: 'ING-007', un: 'g',  saldo: 120,  min: 1000, custo: 0.018 },
    { id: 5, nome: 'Açaí Polpa',     sku: 'ING-010', un: 'g',  saldo: 4200, min: 2000, custo: 0.022 },
  ]);

  readonly movimentacoes = new Collection<AdminMovimentacao>('comanda-admin-movimentacoes', [
    { id: 1, data: '12/03 14:32', ingrediente: 'Blend Bovino',   tipo: 'SAÍDA',   qtd: -360,  motivo: 'VENDA',      referencia: '#0042',  usuario: 'Sistema' },
    { id: 2, data: '12/03 14:32', ingrediente: 'Queijo Cheddar', tipo: 'SAÍDA',   qtd: -80,   motivo: 'VENDA',      referencia: '#0042',  usuario: 'Sistema' },
    { id: 3, data: '10/03 09:15', ingrediente: 'Alface',         tipo: 'ENTRADA', qtd: 2000,  motivo: 'COMPRA',     referencia: '#PC-017', usuario: 'Ana' },
    { id: 4, data: '08/03 16:40', ingrediente: 'Tomate',         tipo: 'PERDA',   qtd: -350,  motivo: 'VENCIMENTO', referencia: '—',       usuario: 'Pedro' },
  ]);

  readonly fornecedores = new Collection<AdminFornecedor>('comanda-admin-fornecedores', [
    { id: 1, razaoSocial: 'Frigorífico São Paulo',     cnpj: '12.345.678/0001-90', telefone: '(11) 9999-0001', email: 'contato@frigosp.com',  status: 'ATIVO' },
    { id: 2, razaoSocial: 'Distribuidora Hortifruti',  cnpj: '98.765.432/0001-10', telefone: '(11) 8888-0002', email: 'vendas@hortifruti.com', status: 'ATIVO' },
    { id: 3, razaoSocial: 'Atacadão do Açaí',          cnpj: '45.678.901/0001-55', telefone: '(11) 7777-0003', email: 'comercial@acai.com',    status: 'INATIVO' },
  ]);

  readonly compras = new Collection<AdminCompra>('comanda-admin-compras', [
    { id: 1, numero: '#PC-018', fornecedor: 'Frigorífico São Paulo',    data: '12/03/2026', itens: 3, total: 480.00, status: 'ENVIADO' },
    { id: 2, numero: '#PC-017', fornecedor: 'Distribuidora Hortifruti', data: '10/03/2026', itens: 5, total: 215.50, status: 'RECEBIDO' },
    { id: 3, numero: '#PC-016', fornecedor: 'Atacadão do Açaí',         data: '08/03/2026', itens: 2, total: 180.00, status: 'RASCUNHO' },
  ]);

  readonly usuarios = new Collection<AdminUsuario>('comanda-admin-usuarios', [
    { id: 1, nome: 'Admin Sistema',    email: 'admin@comanda.com',   perfil: 'ADMIN',      status: 'ATIVO', criadoEm: '01/01/2026' },
    { id: 2, nome: 'Ana Gerente',      email: 'gerente@email.com',   perfil: 'GERENTE',    status: 'ATIVO', criadoEm: '15/01/2026' },
    { id: 3, nome: 'Pedro Cozinheiro', email: 'cozinha@email.com',   perfil: 'COZINHEIRO', status: 'ATIVO', criadoEm: '20/01/2026' },
  ]);
}
