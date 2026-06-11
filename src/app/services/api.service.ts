import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Prato } from './services';

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ordem?: number;
  status?: string;
}

interface PratoApi {
  id: number;
  nome: string;
  descricao: string;
  emoji: string;
  preco: number;
  custo?: number;
  tempoPreparo: number;
  categoria: Categoria;
  status?: string;
  foodCostPct?: number;
}

export interface DashboardResumo {
  faturamentoHoje: number;
  totalPedidosHoje: number;
  ticketMedio: number;
  foodCostMedio: number;
  ingredientesAbaixoMinimo: number;
  topPratos: TopPratoItem[];
  faturamento7Dias: FaturamentoDia[];
}

export interface TopPratoItem {
  nome: string;
  vendas: number;
}

export interface FaturamentoDia {
  dia: string;
  total: number;
}

interface PedidoItem {
  id: number;
  pratoId: number;
  pratoNome: string;
  pratoEmoji: string;
  quantidade: number;
  obs?: string;
  precoUnitario: number;
  subtotal: number;
}

export interface PedidoResponse {
  id: number;
  clienteNome: string;
  clienteId: number;
  status: string;
  total: number;
  endereco: string;
  criadoEm: string;
  itens: PedidoItem[];
}

interface Ingrediente {
  id: number;
  nome: string;
  sku: string;
  unidade: string;
  saldoAtual: number;
  estoqueMinimo: number;
  custoUnitario: number;
  status: string;
  percentualEstoque: number;
}

interface Fornecedor {
  id: number;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  email: string;
  status: string;
}

interface ComprasResponse {
  id: number;
  fornecedorNome: string;
  status: string;
  total: number;
  criadoEm: string;
  itens: Array<{ id: number; ingredienteNome: string; unidade: string; quantidade: number; precoUnitario: number; subtotal: number }>;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  perfil: string;
  status: string;
  criadoEm: string;
}

interface FichaTecnicaItem {
  id: number;
  ingredienteNome: string;
  unidade: string;
  quantidade: number;
  custoUnitario: number;
  custoTotal: number;
}

interface FichaTecnica {
  id: number;
  pratoId: number;
  pratoNome: string;
  rendimento: number;
  tempoPreparo: number;
  modoPreparo: string;
  itens: FichaTecnicaItem[];
  custoTotal: number;
  foodCostPct: number;
}

interface Movimentacao {
  id: number;
  ingredienteNome: string;
  tipo: string;
  quantidade: number;
  motivo: string;
  referencia?: string;
  usuarioNome: string;
  criadoEm: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly localBase = 'http://localhost:8080/api';
  private readonly prodBase = 'https://comanda-digital-production.up.railway.app/api';
  readonly apiBase = this.getBaseUrl();

  constructor(private http: HttpClient) {}

  private getBaseUrl(): string {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return this.localBase;
    }
    return this.prodBase;
  }

  listCategorias(todas = false): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiBase}/categorias?todas=${todas}`).pipe(
      catchError(() => of([]))
    );
  }

  listPratos(todos = false): Observable<Prato[]> {
    return this.http.get<PratoApi[]>(`${this.apiBase}/pratos?todos=${todos}`).pipe(
      map(pratos => pratos.map(p => this.mapPrato(p))),
      catchError(() => of([]))
    );
  }

  getPrato(id: number): Observable<Prato | null> {
    return this.http.get<PratoApi>(`${this.apiBase}/pratos/${id}`).pipe(
      map(prato => this.mapPrato(prato)),
      catchError(() => of(null))
    );
  }

  listPratosAdmin(): Observable<Prato[]> {
    return this.http.get<PratoApi[]>(`${this.apiBase}/admin/pratos`).pipe(
      map(pratos => pratos.map(p => this.mapPrato(p))),
      catchError(() => of([]))
    );
  }

  listDashboardResumo(): Observable<DashboardResumo | null> {
    return this.http.get<DashboardResumo>(`${this.apiBase}/admin/dashboard/resumo`).pipe(
      catchError(() => of(null))
    );
  }

  listDashboardTopPratos(): Observable<TopPratoItem[]> {
    return this.http.get<TopPratoItem[]>(`${this.apiBase}/admin/dashboard/top-pratos`).pipe(
      catchError(() => of([]))
    );
  }

  listPedidosAdmin(abertos = false): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.apiBase}/admin/pedidos?abertos=${abertos}`).pipe(
      catchError(() => of([]))
    );
  }

  listMeusPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.apiBase}/pedidos/meus`).pipe(
      catchError(() => of([]))
    );
  }

  getPedido(id: number): Observable<PedidoResponse | null> {
    return this.http.get<PedidoResponse>(`${this.apiBase}/pedidos/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  createPedido(payload: { itens: Array<{ pratoId: number; quantidade: number; obs?: string }>; endereco: string }) {
    return this.http.post<PedidoResponse>(`${this.apiBase}/pedidos`, payload);
  }

  updatePedidoStatus(id: number, status: string) {
    return this.http.patch<PedidoResponse>(`${this.apiBase}/admin/pedidos/${id}/status`, null, {
      params: { status }
    });
  }

  listCategoriasAdmin(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiBase}/admin/categorias`).pipe(
      catchError(() => of([]))
    );
  }

  listIngredientes(abaixoMinimo = false): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(`${this.apiBase}/ingredientes?abaixoMinimo=${abaixoMinimo}`).pipe(
      catchError(() => of([]))
    );
  }

  listFornecedores(apenasAtivos = false): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(`${this.apiBase}/fornecedores?apenasAtivos=${apenasAtivos}`).pipe(
      catchError(() => of([]))
    );
  }

  listCompras(): Observable<ComprasResponse[]> {
    return this.http.get<ComprasResponse[]>(`${this.apiBase}/compras`).pipe(
      catchError(() => of([]))
    );
  }

  listUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiBase}/usuarios`).pipe(
      catchError(() => of([]))
    );
  }

  listFichas(): Observable<FichaTecnica[]> {
    return this.http.get<FichaTecnica[]>(`${this.apiBase}/fichas`).pipe(
      catchError(() => of([]))
    );
  }

  listMovimentacoes(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.apiBase}/estoque`).pipe(
      catchError(() => of([]))
    );
  }

  listEstoqueAlertas(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(`${this.apiBase}/admin/estoque/alertas`).pipe(
      catchError(() => of([]))
    );
  }

  login(payload: { email: string; senha: string }) {
    return this.http.post<{ token: string }>(`${this.apiBase}/auth/login`, payload);
  }

  register(payload: { nome: string; email: string; senha: string; telefone?: string; endereco?: string }) {
    return this.http.post<{ token: string }>(`${this.apiBase}/auth/register`, payload);
  }

  private mapPrato(api: PratoApi): Prato {
    return {
      id: api.id,
      nome: api.nome,
      emoji: api.emoji || '🍽',
      cat: this.normalizeCategory(api.categoria?.nome || 'outros'),
      desc: api.descricao || '',
      preco: Number(api.preco || 0),
      tempo: api.tempoPreparo || 0,
      destaque: false
    };
  }

  private normalizeCategory(name: string): string {
    return name
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }
}
