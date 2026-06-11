import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/services';
import { ApiService, DashboardResumo, PedidoResponse, TopPratoItem } from '../services/api.service';
import { OrderService } from '../services/order.service';
import { AdminStore, AdminCategoria, AdminPrato, AdminIngrediente, AdminMovimentacao, AdminFornecedor, AdminCompra, AdminUsuario } from '../services/admin-store.service';

@Component({ selector:'app-dashboard', template:`
<div class="admin-layout">
  <app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Dashboard</h2><div class="spacer"></div><span class="text-xs text-muted font-mono">Hoje: 12/03/2026</span></div>
    <div class="admin-inner">
      <div class="alert-banner" style="margin-bottom:20px">
        <span>🔴</span><span><strong>3 ingredientes</strong> abaixo do estoque mínimo — <a routerLink="/admin/ingredientes" style="color:var(--red);font-weight:600">Ver alertas →</a></span>
      </div>
      <div class="kpi-grid" style="margin-bottom:24px">
        <div class="kpi-card kpi-fire"><span class="kpi-icon">💰</span><div class="kpi-label">Faturamento Hoje</div><div class="kpi-value">{{ resumo?.faturamentoHoje | currency:'BRL':'symbol':'1.0-0' }}</div><div class="kpi-sub">Total de pedidos: {{ resumo?.totalPedidosHoje }}</div></div>
        <div class="kpi-card kpi-green"><span class="kpi-icon">📋</span><div class="kpi-label">Total de Pedidos</div><div class="kpi-value">{{ resumo?.totalPedidosHoje }}</div><div class="kpi-sub">Hoje</div></div>
        <div class="kpi-card kpi-amber"><span class="kpi-icon">🎫</span><div class="kpi-label">Ticket Médio</div><div class="kpi-value">{{ resumo?.ticketMedio | currency:'BRL':'symbol':'1.0-0' }}</div><div class="kpi-sub">Média do dia</div></div>
        <div class="kpi-card kpi-red"><span class="kpi-icon">📊</span><div class="kpi-label">Food Cost Médio</div><div class="kpi-value">{{ resumo?.foodCostMedio | number:'1.1-1' }}%</div><div class="kpi-sub">{{ resumo?.ingredientesAbaixoMinimo }} alertas</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 360px;gap:20px;margin-bottom:24px">
        <div class="chart-container">
          <div class="label" style="margin-bottom:16px">Faturamento — Últimos 7 dias</div>
          <div class="chart-bar-group">
            <div class="chart-bar-wrap" *ngFor="let b of bars"><div class="chart-bar-val">{{ b.val }}</div><div class="chart-bar" [style.height.px]="b.h"></div><div class="chart-bar-label">{{ b.label }}</div></div>
          </div>
        </div>
        <div class="chart-container">
          <div class="label" style="margin-bottom:16px">Top 5 Pratos</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div *ngFor="let p of topPratos">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px"><span>{{ p.nome }}</span><span class="font-mono" style="color:var(--fire)">{{ p.vendas }} vendas</span></div>
              <div class="food-cost-bar"><div class="food-cost-fill" [ngClass]="p.cls" [style.width]="p.pct"></div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span>⚠️</span><h3>Ingredientes Críticos</h3><button class="btn btn-outline btn-sm ml-auto" routerLink="/admin/ingredientes">Ver todos</button></div>
        <div class="table-wrap" style="border:none;border-radius:0">
          <table><thead><tr><th>Ingrediente</th><th>Saldo</th><th>Mínimo</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>
            <tr><td>🥩 Blend Bovino</td><td class="font-mono">480g</td><td class="text-muted">1000g</td><td><span class="tag tag-red">CRÍTICO</span></td><td><button class="btn btn-outline btn-sm" routerLink="/admin/compras">Pedir</button></td></tr>
            <tr><td>🥑 Abacate</td><td class="font-mono">120g</td><td class="text-muted">500g</td><td><span class="tag tag-red">CRÍTICO</span></td><td><button class="btn btn-outline btn-sm" routerLink="/admin/compras">Pedir</button></td></tr>
            <tr><td>🧀 Queijo Cheddar</td><td class="font-mono">340g</td><td class="text-muted">500g</td><td><span class="tag tag-amber">BAIXO</span></td><td><button class="btn btn-outline btn-sm" routerLink="/admin/compras">Pedir</button></td></tr>
          </tbody></table>
        </div>
      </div>
    </div>
  </div>
</div>
`})
export class DashboardComponent implements OnInit {
  loading = true;
  resumo: DashboardResumo | null = null;
  bars = [] as Array<{ label: string; val: string; h: number }>;
  topPratos = [] as Array<{ nome: string; vendas: number; cls: string; pct: string }>;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.listDashboardResumo().subscribe({
      next: resumo => {
        this.resumo = resumo;
        this.bars = resumo?.faturamento7Dias?.map(d => ({
          label: d.dia,
          val: `R$ ${Number(d.total).toFixed(0)}`,
          h: Math.min(180, Number(d.total) / 50)
        })) || [];
        this.topPratos = resumo?.topPratos?.map(p => ({
          nome: p.nome,
          vendas: p.vendas,
          cls: p.vendas > 40 ? 'fc-green' : p.vendas > 20 ? 'fc-yellow' : 'fc-red',
          pct: `${Math.min(100, Math.round(p.vendas * 2))}%`
        })) || [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}

@Component({ selector:'app-pedidos-admin', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Pedidos &amp; Cozinha</h2><div class="spacer"></div><span class="tag tag-fire">{{ pedidos.length }} em aberto</span></div>
    <div class="admin-inner">
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <div class="cat-pills">
          <button class="cat-pill" [class.active]="filtro==='all'" (click)="setFilter('all')">Todos</button>
          <button class="cat-pill" [class.active]="filtro==='PAGO'" (click)="setFilter('PAGO')">Pago</button>
          <button class="cat-pill" [class.active]="filtro==='EM_PREPARO'" (click)="setFilter('EM_PREPARO')">Em Preparo</button>
          <button class="cat-pill" [class.active]="filtro==='PRONTO'" (click)="setFilter('PRONTO')">Pronto</button>
        </div>
      </div>
      <div *ngIf="loading" style="text-align:center;padding:40px 0">Carregando pedidos...</div>
      <div *ngIf="!loading && pedidos.length === 0" class="empty-state" style="padding:40px 0">
        <div class="empty-icon">📦</div>
        <p>Nenhum pedido encontrado.</p>
      </div>
      <div class="pedido-grid" *ngIf="!loading && pedidos.length > 0">
        <div *ngFor="let pedido of pedidos" class="pedido-card" [style.border-color]="borderColor(pedido.status)">
          <div class="pedido-card-header">
            <span class="pedido-num">#{{ pedido.id }}</span>
            <span class="tag" [ngClass]="statusClass(pedido.status)">{{ pedido.status }}</span>
            <span class="timer-chip ml-auto">{{ pedido.criadoEm | date:'shortTime' }}</span>
          </div>
          <div class="pedido-card-body">
            <div class="text-xs text-muted" style="margin-bottom:10px">Cliente: {{ pedido.clienteNome }}</div>
            <div *ngFor="let item of pedido.itens" class="pedido-item-row"><span class="pedido-item-qty">{{ item.quantidade }}x</span><span>{{ item.pratoNome }}</span></div>
          </div>
          <div class="pedido-card-footer" style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-outline btn-sm" (click)="changeStatus(pedido, 'EM_PREPARO')">Em Preparo</button>
            <button class="btn btn-outline btn-sm" (click)="changeStatus(pedido, 'PRONTO')">Pronto</button>
            <button class="btn btn-outline btn-sm" (click)="changeStatus(pedido, 'SAIU_ENTREGA')">Saiu p/ Entrega</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`})
export class PedidosAdminComponent implements OnInit, OnDestroy {
  filtro='all';
  pedidos: PedidoResponse[] = [];
  loading = true;
  private refreshInterval?: number;

  constructor(private orders: OrderService, public toast: ToastService) {}

  ngOnInit() {
    this.loadPedidos();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private startAutoRefresh() {
    this.refreshInterval = window.setInterval(() => {
      this.loadPedidos(true);
    }, 10000);
  }

  loadPedidos(silent = false) {
    if (!silent) {
      this.loading = true;
    }
    const todos = this.orders.list();
    this.pedidos = this.filtro === 'all' ? todos : todos.filter(p => p.status === this.filtro);
    this.loading = false;
  }

  setFilter(filtro: string) {
    this.filtro = filtro;
    this.loadPedidos();
  }

  borderColor(status: string) {
    return status === 'EM_PREPARO' ? 'rgba(255,92,26,.4)' : status === 'PRONTO' ? 'rgba(40,199,111,.4)' : status === 'PAGO' || status === 'RECEBIDO' || status === 'CONFIRMADO' ? 'rgba(245,166,35,.4)' : 'rgba(128,128,128,.25)';
  }

  statusClass(status: string) {
    return status === 'EM_PREPARO' ? 'tag-fire' : status === 'PRONTO' ? 'tag-green' : status === 'PAGO' || status === 'RECEBIDO' || status === 'CONFIRMADO' ? 'tag-amber' : 'tag-gray';
  }

  changeStatus(pedido: PedidoResponse, status: string) {
    const updated = this.orders.updateStatus(pedido.id, status);
    if (updated) {
      this.toast.success(`Pedido #${updated.id} atualizado para ${updated.status}.`);
      this.loadPedidos();
    } else {
      this.toast.error('Falha ao atualizar status do pedido.');
    }
  }
}

@Component({ selector:'app-pratos', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Pratos</h2><div class="spacer"></div><button class="btn btn-fire btn-sm" (click)="openNew()">+ Novo Prato</button></div>
    <div class="admin-inner">
      <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
        <div class="search-wrap"><span class="search-icon">🔍</span><input class="search-input" placeholder="Buscar prato..." [(ngModel)]="busca"></div>
        <select class="form-select" style="width:180px" [(ngModel)]="filtroCat"><option value="">Todas categorias</option><option *ngFor="let c of categorias" [value]="c.nome">{{ c.nome }}</option></select>
      </div>
      <div class="table-wrap">
        <table><thead><tr><th>Prato</th><th>Categoria</th><th>Preço</th><th>Custo</th><th>Food Cost</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let p of filtrados()">
            <td><strong>{{ p.nome }}</strong><div class="text-xs text-muted">{{ p.desc }}</div></td>
            <td>{{ p.cat }}</td>
            <td class="font-hero" style="font-size:16px;color:var(--fire)">R$ {{ p.preco | number:'1.2-2' }}</td>
            <td class="font-mono">R$ {{ p.custo | number:'1.2-2' }}</td>
            <td><span [style.color]="fcColor(p.fcPct)" style="font-weight:600">{{ p.fcPct | number:'1.1-1' }}%</span><div class="food-cost-bar" style="width:80px"><div class="food-cost-fill" [ngClass]="fcCls(p.fcPct)" [style.width.%]="min100(p.fcPct*2)"></div></div></td>
            <td><span class="tag" [ngClass]="statusCls(p.status)">{{ p.status }}</span></td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" (click)="openEdit(p)">✏</button><button class="btn btn-ghost btn-sm" routerLink="/admin/fichas">📝</button><button class="btn btn-ghost btn-sm" (click)="remove(p)">🗑</button></div></td>
          </tr>
          <tr *ngIf="filtrados().length === 0"><td colspan="7" class="text-muted" style="text-align:center;padding:24px">Nenhum prato encontrado.</td></tr>
        </tbody></table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" [class.open]="modal" (click)="modal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>🍽 {{ form.id ? 'Editar' : 'Novo' }} Prato</h3><button class="modal-close" (click)="modal=false">✕</button></div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-group" style="grid-column:1/-1"><label class="form-label">Nome do prato *</label><input type="text" class="form-input" placeholder="Ex: Burger Artesanal" [(ngModel)]="form.nome"></div>
        <div class="form-group"><label class="form-label">Categoria *</label><select class="form-select" [(ngModel)]="form.cat"><option *ngFor="let c of categorias" [value]="c.nome">{{ c.nome }}</option></select></div>
        <div class="form-group"><label class="form-label">Preço de Venda (R$) *</label><input type="number" class="form-input" placeholder="0,00" step="0.01" [(ngModel)]="form.preco"></div>
        <div class="form-group"><label class="form-label">Custo (R$)</label><input type="number" class="form-input" placeholder="0,00" step="0.01" [(ngModel)]="form.custo"></div>
        <div class="form-group"><label class="form-label">Status</label><select class="form-select" [(ngModel)]="form.status"><option>ATIVO</option><option>INATIVO</option><option>PAUSADO</option></select></div>
        <div class="form-group" style="grid-column:1/-1"><label class="form-label">Descrição</label><textarea class="form-input" rows="3" placeholder="Descreva o prato..." [(ngModel)]="form.desc"></textarea></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" (click)="modal=false">Cancelar</button><button class="btn btn-fire" (click)="save()">Salvar Prato</button></div>
  </div>
</div>
`})
export class PratosComponent implements OnInit {
  modal = false;
  busca = '';
  filtroCat = '';
  pratos: AdminPrato[] = [];
  categorias: AdminCategoria[] = [];
  form: AdminPrato = this.empty();

  constructor(private toast: ToastService, private store: AdminStore) {}

  ngOnInit() { this.reload(); this.categorias = this.store.categorias.list(); }
  reload() { this.pratos = this.store.pratos.list(); }

  filtrados(): AdminPrato[] {
    return this.pratos.filter(p =>
      (!this.filtroCat || p.cat === this.filtroCat) &&
      (!this.busca || p.nome.toLowerCase().includes(this.busca.toLowerCase()))
    );
  }

  empty(): AdminPrato { return { id: 0, nome: '', desc: '', cat: 'Lanches', preco: 0, custo: 0, fcPct: 0, status: 'ATIVO' }; }
  openNew() { this.form = this.empty(); if (this.categorias[0]) this.form.cat = this.categorias[0].nome; this.modal = true; }
  openEdit(p: AdminPrato) { this.form = { ...p }; this.modal = true; }

  save() {
    if (!this.form.nome.trim()) { this.toast.error('Informe o nome do prato.'); return; }
    if (!this.form.preco || this.form.preco <= 0) { this.toast.error('Informe um preço válido.'); return; }
    this.form.fcPct = this.form.preco > 0 ? (this.form.custo / this.form.preco) * 100 : 0;
    this.store.pratos.save(this.form);
    this.modal = false;
    this.reload();
    this.toast.success('Prato salvo com sucesso!');
  }

  remove(p: AdminPrato) {
    this.store.pratos.remove(p.id);
    this.reload();
    this.toast.success('Prato removido.');
  }

  min100(v: number) { return Math.min(100, v); }
  fcColor(pct: number) { return pct > 35 ? 'var(--red)' : pct > 28 ? 'var(--yellow)' : 'var(--green)'; }
  fcCls(pct: number) { return pct > 35 ? 'fc-red' : pct > 28 ? 'fc-yellow' : 'fc-green'; }
  statusCls(status: string) { return status === 'ATIVO' ? 'tag-green' : status === 'PAUSADO' ? 'tag-amber' : 'tag-gray'; }
}

@Component({ selector:'app-fichas', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Ficha Técnica — {{ pratoNome }}</h2><div class="spacer"></div><button class="btn btn-fire btn-sm" (click)="save()">💾 Salvar</button></div>
    <div class="admin-inner">
      <div style="display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start">
        <div>
          <div class="card" style="margin-bottom:16px">
            <div class="card-header"><span>⚙️</span><h3>Configurações Gerais</h3></div>
            <div class="card-body">
              <div class="form-grid form-grid-2">
                <div class="form-group"><label class="form-label">Prato</label><select class="form-select" [(ngModel)]="pratoNome"><option *ngFor="let p of pratos" [value]="p.nome">{{ p.nome }}</option></select></div>
                <div class="form-group"><label class="form-label">Preço de Venda (R$)</label><input type="number" class="form-input" [(ngModel)]="precoVenda" step="0.01"></div>
                <div class="form-group"><label class="form-label">Rendimento (porções)</label><input type="number" class="form-input" [(ngModel)]="rendimento"></div>
                <div class="form-group"><label class="form-label">Tempo de Preparo (min)</label><input type="number" class="form-input" [(ngModel)]="tempo"></div>
              </div>
              <div class="form-group mt-16"><label class="form-label">Modo de Preparo</label><textarea class="form-input" rows="3" [(ngModel)]="modoPreparo"></textarea></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span>🥗</span><h3>Ingredientes</h3><button class="btn btn-ghost btn-sm ml-auto" (click)="addRow()">+ Adicionar</button></div>
            <div class="table-wrap" style="border:none;border-radius:0">
              <table><thead><tr><th>Ingrediente</th><th>Qtd</th><th>Un</th><th>F.C.</th><th>Custo/Un</th><th>Custo Total</th><th></th></tr></thead>
              <tbody>
                <tr *ngFor="let r of rows; let idx = index">
                  <td><input type="text" class="form-input" style="width:140px;padding:6px 8px" [(ngModel)]="r.nome"></td>
                  <td><input type="number" class="form-input" style="width:70px;padding:6px 8px" [(ngModel)]="r.qtd"></td>
                  <td><input type="text" class="form-input" style="width:50px;padding:6px 8px" [(ngModel)]="r.un"></td>
                  <td><input type="number" class="form-input" style="width:70px;padding:6px 8px" [(ngModel)]="r.fc" step="0.01"></td>
                  <td><input type="number" class="form-input" style="width:90px;padding:6px 8px" [(ngModel)]="r.custoUn" step="0.001"></td>
                  <td class="font-hero" style="font-size:16px;color:var(--fire)">R$ {{ custoLinha(r) | number:'1.2-2' }}</td>
                  <td><button class="btn btn-ghost btn-sm" (click)="removeRow(idx)">🗑</button></td>
                </tr>
                <tr *ngIf="rows.length === 0"><td colspan="7" class="text-muted" style="text-align:center;padding:16px">Adicione ingredientes à ficha.</td></tr>
              </tbody></table>
            </div>
          </div>
        </div>
        <div style="position:sticky;top:80px">
          <div class="card">
            <div class="card-header"><span>📊</span><h3>Análise de Custo</h3></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;justify-content:space-between;font-size:13px"><span class="text-muted">Custo total</span><span class="font-hero" style="font-size:22px">R$ {{ custoTotal() | number:'1.2-2' }}</span></div>
              <div style="display:flex;justify-content:space-between;font-size:13px"><span class="text-muted">Preço de venda</span><span class="font-mono">R$ {{ precoVenda | number:'1.2-2' }}</span></div>
              <div class="divider" style="margin:4px 0"></div>
              <div style="text-align:center"><div class="label" style="margin-bottom:4px">Food Cost</div><div class="font-hero" style="font-size:48px" [style.color]="foodCost() > 35 ? 'var(--red)' : 'var(--green)'">{{ foodCost() | number:'1.1-1' }}%</div><span class="tag" [ngClass]="foodCost() > 35 ? 'tag-red' : 'tag-green'">{{ foodCost() > 35 ? '⚠ ACIMA DO LIMITE' : '✔ DENTRO DA META' }}</span></div>
              <div class="alert-banner amber" style="font-size:12px" *ngIf="foodCost() > 35">⚠ Food cost acima de 35%. Considere revisar ingredientes ou ajustar preço.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`})
export class FichasComponent implements OnInit {
  private readonly storageKey = 'comanda-admin-ficha';
  pratoNome = 'Burger Artesanal';
  precoVenda = 39.90;
  rendimento = 1;
  tempo = 12;
  modoPreparo = '1. Temperar blend bovino. 2. Grelhar 4 min de cada lado. 3. Montar no pão brioche.';
  pratos: AdminPrato[] = [];
  rows = [
    { nome: 'Blend Bovino',   qtd: 180, un: 'g',  fc: 1.00, custoUn: 0.045 },
    { nome: 'Pão Brioche',    qtd: 1,   un: 'un', fc: 1.00, custoUn: 2.80 },
    { nome: 'Queijo Cheddar', qtd: 40,  un: 'g',  fc: 1.00, custoUn: 0.065 },
    { nome: 'Alface',         qtd: 30,  un: 'g',  fc: 1.40, custoUn: 0.012 },
    { nome: 'Molho Especial', qtd: 25,  un: 'ml', fc: 1.00, custoUn: 0.032 },
  ];

  constructor(public toast: ToastService, private store: AdminStore) {}

  ngOnInit() {
    this.pratos = this.store.pratos.list();
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try { Object.assign(this, JSON.parse(raw)); } catch { /* mantém os valores padrão */ }
    }
  }

  custoLinha(r: { qtd: number; fc: number; custoUn: number }) { return (r.qtd || 0) * (r.fc || 1) * (r.custoUn || 0); }
  custoTotal() { return this.rows.reduce((s, r) => s + this.custoLinha(r), 0); }
  foodCost() { return this.precoVenda > 0 ? (this.custoTotal() / this.precoVenda) * 100 : 0; }

  addRow() { this.rows.push({ nome: '', qtd: 0, un: 'g', fc: 1.00, custoUn: 0 }); }
  removeRow(idx: number) { this.rows.splice(idx, 1); }

  save() {
    const data = {
      pratoNome: this.pratoNome, precoVenda: this.precoVenda, rendimento: this.rendimento,
      tempo: this.tempo, modoPreparo: this.modoPreparo, rows: this.rows
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.toast.success('Ficha técnica salva!');
  }
}

@Component({ selector:'app-ingredientes', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Ingredientes &amp; Estoque</h2><div class="spacer"></div><button class="btn btn-fire btn-sm" (click)="openNew()">+ Novo Ingrediente</button></div>
    <div class="admin-inner">
      <div class="alert-banner" style="margin-bottom:20px" *ngIf="abaixoMinimo() > 0">🔴 <strong>{{ abaixoMinimo() }} ingrediente(s)</strong> estão abaixo do estoque mínimo</div>
      <div class="table-wrap">
        <table><thead><tr><th>Ingrediente</th><th>SKU</th><th>Un</th><th>Saldo</th><th>Mínimo</th><th>Custo/Un</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let i of ings">
            <td><strong>{{ i.nome }}</strong></td><td class="font-mono text-muted">{{ i.sku }}</td><td>{{ i.un }}</td>
            <td><span class="font-mono" [style.color]="saldoColor(i)">{{ i.saldo }}{{ i.un }}</span><div class="estoque-bar" style="width:100px"><div class="estoque-fill" [ngClass]="cls(i)" [style.width.%]="pct(i)"></div></div></td>
            <td class="font-mono text-muted">{{ i.min }}{{ i.un }}</td><td class="font-mono">R$ {{ i.custo | number:'1.4-4' }}</td>
            <td><span class="tag" [ngClass]="statusCls(i)">{{ status(i) }}</span></td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" (click)="openEdit(i)">✏</button><button class="btn btn-ghost btn-sm" (click)="openAjuste(i)">± Ajuste</button><button class="btn btn-ghost btn-sm" (click)="remove(i)">🗑</button></div></td>
          </tr>
          <tr *ngIf="ings.length === 0"><td colspan="8" class="text-muted" style="text-align:center;padding:24px">Nenhum ingrediente cadastrado.</td></tr>
        </tbody></table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" [class.open]="modal" (click)="modal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>🥗 {{ form.id ? 'Editar' : 'Novo' }} Ingrediente</h3><button class="modal-close" (click)="modal=false">✕</button></div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-group"><label class="form-label">Nome *</label><input type="text" class="form-input" placeholder="Blend Bovino" [(ngModel)]="form.nome"></div>
        <div class="form-group"><label class="form-label">SKU *</label><input type="text" class="form-input" placeholder="ING-001" [(ngModel)]="form.sku"></div>
        <div class="form-group"><label class="form-label">Unidade Padrão *</label><select class="form-select" [(ngModel)]="form.un"><option>g</option><option>ml</option><option>un</option><option>kg</option><option>L</option></select></div>
        <div class="form-group"><label class="form-label">Saldo Atual *</label><input type="number" class="form-input" placeholder="0" [(ngModel)]="form.saldo"></div>
        <div class="form-group"><label class="form-label">Estoque Mínimo *</label><input type="number" class="form-input" placeholder="500" [(ngModel)]="form.min"></div>
        <div class="form-group"><label class="form-label">Custo Unitário (R$) *</label><input type="number" class="form-input" placeholder="0,0000" step="0.0001" [(ngModel)]="form.custo"></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" (click)="modal=false">Cancelar</button><button class="btn btn-fire" (click)="save()">Salvar</button></div>
  </div>
</div>
<div class="modal-overlay" [class.open]="modalAjuste" (click)="modalAjuste=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>📦 Ajuste de Estoque</h3><button class="modal-close" (click)="modalAjuste=false">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Ingrediente</label><input type="text" class="form-input" [value]="ajusteAlvo?.nome" disabled></div>
      <div class="form-grid form-grid-2" style="margin-top:12px">
        <div class="form-group"><label class="form-label">Tipo *</label><select class="form-select" [(ngModel)]="ajuste.tipo"><option value="SAÍDA">Saída</option><option value="ENTRADA">Entrada</option><option value="PERDA">Perda</option></select></div>
        <div class="form-group"><label class="form-label">Quantidade *</label><input type="number" class="form-input" placeholder="0" [(ngModel)]="ajuste.qtd"></div>
      </div>
      <div class="form-group" style="margin-top:12px"><label class="form-label">Motivo *</label><select class="form-select" [(ngModel)]="ajuste.motivo"><option>VENDA</option><option>COMPRA</option><option>DESPERDICIO</option><option>VENCIMENTO</option><option>QUEBRA</option><option>USO_INTERNO</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" (click)="modalAjuste=false">Cancelar</button><button class="btn btn-fire" (click)="saveAjuste()">Registrar</button></div>
  </div>
</div>
`})
export class IngredientesComponent implements OnInit {
  modal = false; modalAjuste = false;
  ings: AdminIngrediente[] = [];
  form: AdminIngrediente = this.empty();
  ajusteAlvo: AdminIngrediente | null = null;
  ajuste = { tipo: 'SAÍDA', qtd: 0, motivo: 'DESPERDICIO' };

  constructor(private toast: ToastService, private store: AdminStore) {}

  ngOnInit() { this.reload(); }
  reload() { this.ings = this.store.ingredientes.list(); }

  empty(): AdminIngrediente { return { id: 0, nome: '', sku: '', un: 'g', saldo: 0, min: 0, custo: 0 }; }
  openNew() { this.form = this.empty(); this.modal = true; }
  openEdit(i: AdminIngrediente) { this.form = { ...i }; this.modal = true; }

  save() {
    if (!this.form.nome.trim()) { this.toast.error('Informe o nome do ingrediente.'); return; }
    if (!this.form.sku.trim()) { this.toast.error('Informe o SKU.'); return; }
    this.store.ingredientes.save(this.form);
    this.modal = false;
    this.reload();
    this.toast.success('Ingrediente salvo!');
  }

  remove(i: AdminIngrediente) {
    this.store.ingredientes.remove(i.id);
    this.reload();
    this.toast.success('Ingrediente removido.');
  }

  openAjuste(i: AdminIngrediente) { this.ajusteAlvo = i; this.ajuste = { tipo: 'SAÍDA', qtd: 0, motivo: 'DESPERDICIO' }; this.modalAjuste = true; }

  saveAjuste() {
    if (!this.ajusteAlvo) { return; }
    const qtd = Number(this.ajuste.qtd);
    if (!qtd || qtd <= 0) { this.toast.error('Informe uma quantidade válida.'); return; }
    const delta = this.ajuste.tipo === 'ENTRADA' ? qtd : -qtd;
    const alvo = { ...this.ajusteAlvo, saldo: this.ajusteAlvo.saldo + delta };
    this.store.ingredientes.save(alvo);
    this.store.movimentacoes.save({
      id: 0,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ingrediente: this.ajusteAlvo.nome,
      tipo: this.ajuste.tipo,
      qtd: delta,
      motivo: this.ajuste.motivo,
      referencia: '—',
      usuario: 'Admin'
    } as AdminMovimentacao);
    this.modalAjuste = false;
    this.reload();
    this.toast.success('Movimentação registrada no estoque!');
  }

  abaixoMinimo() { return this.ings.filter(i => i.saldo < i.min).length; }
  pct(i: AdminIngrediente) { return Math.min(100, Math.round((i.saldo / (i.min * 2 || 1)) * 100)); }
  status(i: AdminIngrediente) { return i.saldo < i.min * 0.5 ? 'CRÍTICO' : i.saldo < i.min ? 'BAIXO' : 'OK'; }
  statusCls(i: AdminIngrediente) { const s = this.status(i); return s === 'CRÍTICO' ? 'tag-red' : s === 'BAIXO' ? 'tag-amber' : 'tag-green'; }
  saldoColor(i: AdminIngrediente) { const s = this.status(i); return s === 'CRÍTICO' ? 'var(--red)' : s === 'BAIXO' ? 'var(--amber)' : 'var(--green)'; }
  cls(i: AdminIngrediente) { const s = this.status(i); return s === 'CRÍTICO' ? 'ef-critical' : s === 'BAIXO' ? 'ef-low' : 'ef-ok'; }
}

@Component({ selector:'app-fornecedores', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Fornecedores</h2><div class="spacer"></div><button class="btn btn-fire btn-sm" (click)="openNew()">+ Novo Fornecedor</button></div>
    <div class="admin-inner">
      <div class="table-wrap">
        <table><thead><tr><th>Razão Social</th><th>CNPJ</th><th>Contato</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let f of fornecedores">
            <td><strong>{{ f.razaoSocial }}</strong></td>
            <td class="font-mono text-muted">{{ f.cnpj }}</td>
            <td><div class="text-sm">📞 {{ f.telefone }}</div><div class="text-xs text-muted">{{ f.email }}</div></td>
            <td><span class="tag" [ngClass]="f.status === 'ATIVO' ? 'tag-green' : 'tag-amber'">{{ f.status }}</span></td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" (click)="openEdit(f)">✏</button><button class="btn btn-ghost btn-sm" (click)="remove(f)">🗑</button></div></td>
          </tr>
          <tr *ngIf="fornecedores.length === 0"><td colspan="5" class="text-muted" style="text-align:center;padding:24px">Nenhum fornecedor cadastrado.</td></tr>
        </tbody></table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" [class.open]="modal" (click)="modal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>🏭 {{ form.id ? 'Editar' : 'Novo' }} Fornecedor</h3><button class="modal-close" (click)="modal=false">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Razão Social *</label><input type="text" class="form-input" placeholder="Empresa LTDA" [(ngModel)]="form.razaoSocial"></div>
      <div class="form-grid form-grid-2" style="margin-top:12px"><div class="form-group"><label class="form-label">CNPJ *</label><input type="text" class="form-input" placeholder="00.000.000/0001-00" [(ngModel)]="form.cnpj"></div><div class="form-group"><label class="form-label">Telefone</label><input type="text" class="form-input" placeholder="(11) 9999-0000" [(ngModel)]="form.telefone"></div></div>
      <div class="form-grid form-grid-2" style="margin-top:12px">
        <div class="form-group"><label class="form-label">E-mail</label><input type="email" class="form-input" placeholder="contato@empresa.com" [(ngModel)]="form.email"></div>
        <div class="form-group"><label class="form-label">Status</label><select class="form-select" [(ngModel)]="form.status"><option>ATIVO</option><option>INATIVO</option></select></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" (click)="modal=false">Cancelar</button><button class="btn btn-fire" (click)="save()">Salvar</button></div>
  </div>
</div>
`})
export class FornecedoresComponent implements OnInit {
  modal = false;
  fornecedores: AdminFornecedor[] = [];
  form: AdminFornecedor = this.empty();

  constructor(private toast: ToastService, private store: AdminStore) {}

  ngOnInit() { this.reload(); }
  reload() { this.fornecedores = this.store.fornecedores.list(); }

  empty(): AdminFornecedor { return { id: 0, razaoSocial: '', cnpj: '', telefone: '', email: '', status: 'ATIVO' }; }
  openNew() { this.form = this.empty(); this.modal = true; }
  openEdit(f: AdminFornecedor) { this.form = { ...f }; this.modal = true; }

  save() {
    if (!this.form.razaoSocial.trim()) { this.toast.error('Informe a razão social.'); return; }
    if (!this.form.cnpj.trim()) { this.toast.error('Informe o CNPJ.'); return; }
    this.store.fornecedores.save(this.form);
    this.modal = false;
    this.reload();
    this.toast.success('Fornecedor salvo!');
  }

  remove(f: AdminFornecedor) {
    this.store.fornecedores.remove(f.id);
    this.reload();
    this.toast.success('Fornecedor removido.');
  }
}

@Component({ selector:'app-compras', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Pedidos de Compra</h2><div class="spacer"></div><button class="btn btn-fire btn-sm" (click)="openNew()">+ Nova Compra</button></div>
    <div class="admin-inner">
      <div class="table-wrap">
        <table><thead><tr><th>Nº</th><th>Fornecedor</th><th>Data</th><th>Itens</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let c of compras">
            <td class="font-mono">{{ c.numero }}</td>
            <td>{{ c.fornecedor }}</td>
            <td class="text-muted">{{ c.data }}</td>
            <td class="text-muted">{{ c.itens }} itens</td>
            <td class="font-hero" style="font-size:16px;color:var(--fire)">R$ {{ c.total | number:'1.2-2' }}</td>
            <td><span class="tag" [ngClass]="statusCls(c.status)">{{ c.status }}</span></td>
            <td><div style="display:flex;gap:4px">
              <button *ngIf="c.status === 'RASCUNHO'" class="btn btn-fire btn-sm" (click)="setStatus(c, 'ENVIADO')">Enviar</button>
              <button *ngIf="c.status === 'ENVIADO'" class="btn btn-green btn-sm" (click)="setStatus(c, 'RECEBIDO')">✅ Receber</button>
              <button class="btn btn-ghost btn-sm" (click)="remove(c)">🗑</button>
            </div></td>
          </tr>
          <tr *ngIf="compras.length === 0"><td colspan="7" class="text-muted" style="text-align:center;padding:24px">Nenhum pedido de compra.</td></tr>
        </tbody></table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" [class.open]="modal" (click)="modal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>🛒 Novo Pedido de Compra</h3><button class="modal-close" (click)="modal=false">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Fornecedor *</label><select class="form-select" [(ngModel)]="form.fornecedor"><option *ngFor="let f of fornecedores" [value]="f.razaoSocial">{{ f.razaoSocial }}</option></select></div>
      <div class="form-grid form-grid-2" style="margin-top:12px">
        <div class="form-group"><label class="form-label">Qtd de itens *</label><input type="number" class="form-input" placeholder="0" [(ngModel)]="form.itens"></div>
        <div class="form-group"><label class="form-label">Total (R$) *</label><input type="number" class="form-input" placeholder="0,00" step="0.01" [(ngModel)]="form.total"></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" (click)="modal=false">Cancelar</button><button class="btn btn-outline" (click)="save('RASCUNHO')">Salvar Rascunho</button><button class="btn btn-fire" (click)="save('ENVIADO')">Enviar Pedido</button></div>
  </div>
</div>
`})
export class ComprasComponent implements OnInit {
  modal = false;
  compras: AdminCompra[] = [];
  fornecedores: AdminFornecedor[] = [];
  form: AdminCompra = this.empty();

  constructor(public toast: ToastService, private store: AdminStore) {}

  ngOnInit() { this.reload(); this.fornecedores = this.store.fornecedores.list(); }
  reload() { this.compras = this.store.compras.list(); }

  empty(): AdminCompra { return { id: 0, numero: '', fornecedor: '', data: '', itens: 0, total: 0, status: 'RASCUNHO' }; }

  openNew() {
    this.form = this.empty();
    if (this.fornecedores[0]) this.form.fornecedor = this.fornecedores[0].razaoSocial;
    this.modal = true;
  }

  save(status: string) {
    if (!this.form.fornecedor) { this.toast.error('Selecione um fornecedor.'); return; }
    const proximoNum = this.compras.reduce((max, c) => Math.max(max, parseInt(c.numero.replace(/\D/g, ''), 10) || 0), 0) + 1;
    this.form.numero = '#PC-' + String(proximoNum).padStart(3, '0');
    this.form.data = new Date().toLocaleDateString('pt-BR');
    this.form.status = status;
    this.store.compras.save(this.form);
    this.modal = false;
    this.reload();
    this.toast.success(status === 'ENVIADO' ? 'Pedido enviado ao fornecedor!' : 'Rascunho salvo!');
  }

  setStatus(c: AdminCompra, status: string) {
    this.store.compras.save({ ...c, status });
    this.reload();
    this.toast.success(status === 'RECEBIDO' ? 'Recebimento registrado!' : 'Pedido enviado!');
  }

  remove(c: AdminCompra) {
    this.store.compras.remove(c.id);
    this.reload();
    this.toast.success('Pedido de compra removido.');
  }

  statusCls(status: string) { return status === 'RECEBIDO' ? 'tag-green' : status === 'ENVIADO' ? 'tag-amber' : 'tag-gray'; }
}

@Component({ selector:'app-usuarios', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Gerenciar Usuários</h2><div class="spacer"></div><button class="btn btn-fire btn-sm" (click)="openNew()">+ Novo Usuário</button></div>
    <div class="admin-inner">
      <div class="table-wrap">
        <table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th><th>Criado em</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let u of usuarios">
            <td><strong>{{ u.nome }}</strong></td>
            <td class="font-mono text-muted">{{ u.email }}</td>
            <td><span class="tag" [ngClass]="perfilCls(u.perfil)">{{ u.perfil }}</span></td>
            <td><span class="tag" [ngClass]="u.status === 'ATIVO' ? 'tag-green' : 'tag-gray'">{{ u.status }}</span></td>
            <td class="text-muted">{{ u.criadoEm }}</td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" (click)="openEdit(u)">✏</button><button class="btn btn-ghost btn-sm" (click)="remove(u)">🗑</button></div></td>
          </tr>
          <tr *ngIf="usuarios.length === 0"><td colspan="6" class="text-muted" style="text-align:center;padding:24px">Nenhum usuário cadastrado.</td></tr>
        </tbody></table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" [class.open]="modal" (click)="modal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>👤 {{ form.id ? 'Editar' : 'Novo' }} Usuário</h3><button class="modal-close" (click)="modal=false">✕</button></div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-group"><label class="form-label">Nome *</label><input type="text" class="form-input" placeholder="João da Silva" [(ngModel)]="form.nome"></div>
        <div class="form-group"><label class="form-label">Perfil *</label><select class="form-select" [(ngModel)]="form.perfil"><option>ADMIN</option><option>GERENTE</option><option>COZINHEIRO</option></select></div>
        <div class="form-group" style="grid-column:1/-1"><label class="form-label">E-mail *</label><input type="email" class="form-input" placeholder="usuario@email.com" [(ngModel)]="form.email"></div>
        <div class="form-group"><label class="form-label">Status</label><select class="form-select" [(ngModel)]="form.status"><option>ATIVO</option><option>INATIVO</option></select></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" (click)="modal=false">Cancelar</button><button class="btn btn-fire" (click)="save()">Salvar Usuário</button></div>
  </div>
</div>
`})
export class UsuariosComponent implements OnInit {
  modal = false;
  usuarios: AdminUsuario[] = [];
  form: AdminUsuario = this.empty();

  constructor(private toast: ToastService, private store: AdminStore) {}

  ngOnInit() { this.reload(); }
  reload() { this.usuarios = this.store.usuarios.list(); }

  empty(): AdminUsuario { return { id: 0, nome: '', email: '', perfil: 'GERENTE', status: 'ATIVO', criadoEm: new Date().toLocaleDateString('pt-BR') }; }
  openNew() { this.form = this.empty(); this.modal = true; }
  openEdit(u: AdminUsuario) { this.form = { ...u }; this.modal = true; }

  save() {
    if (!this.form.nome.trim()) { this.toast.error('Informe o nome.'); return; }
    if (!this.form.email.trim()) { this.toast.error('Informe o e-mail.'); return; }
    this.store.usuarios.save(this.form);
    this.modal = false;
    this.reload();
    this.toast.success('Usuário salvo com sucesso!');
  }

  remove(u: AdminUsuario) {
    this.store.usuarios.remove(u.id);
    this.reload();
    this.toast.success('Usuário removido.');
  }

  perfilCls(perfil: string) { return perfil === 'ADMIN' ? 'tag-fire' : perfil === 'GERENTE' ? 'tag-amber' : 'tag-gray'; }
}

@Component({ selector:'app-categorias', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Categorias</h2><div class="spacer"></div><button class="btn btn-fire btn-sm" (click)="openNew()">+ Nova Categoria</button></div>
    <div class="admin-inner">
      <div class="table-wrap">
        <table><thead><tr><th>Nome</th><th>Descrição</th><th>Ordem</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let c of categorias">
            <td>{{ c.emoji }} {{ c.nome }}</td>
            <td class="text-muted">{{ c.descricao }}</td>
            <td>{{ c.ordem }}</td>
            <td><span class="tag" [ngClass]="c.status === 'ATIVO' ? 'tag-green' : 'tag-gray'">{{ c.status }}</span></td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" (click)="openEdit(c)">✏</button><button class="btn btn-ghost btn-sm" (click)="remove(c)">🗑</button></div></td>
          </tr>
          <tr *ngIf="categorias.length === 0"><td colspan="5" class="text-muted" style="text-align:center;padding:24px">Nenhuma categoria cadastrada.</td></tr>
        </tbody></table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" [class.open]="modal" (click)="modal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>🏷 {{ form.id ? 'Editar' : 'Nova' }} Categoria</h3><button class="modal-close" (click)="modal=false">✕</button></div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-group"><label class="form-label">Emoji</label><input type="text" class="form-input" placeholder="🍔" [(ngModel)]="form.emoji"></div>
        <div class="form-group"><label class="form-label">Nome *</label><input type="text" class="form-input" placeholder="Ex: Lanches" [(ngModel)]="form.nome"></div>
      </div>
      <div class="form-group" style="margin-top:12px"><label class="form-label">Descrição</label><input type="text" class="form-input" placeholder="Descrição breve" [(ngModel)]="form.descricao"></div>
      <div class="form-grid form-grid-2" style="margin-top:12px">
        <div class="form-group"><label class="form-label">Ordem de exibição</label><input type="number" class="form-input" placeholder="1" [(ngModel)]="form.ordem"></div>
        <div class="form-group"><label class="form-label">Status</label><select class="form-select" [(ngModel)]="form.status"><option>ATIVO</option><option>INATIVO</option></select></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" (click)="modal=false">Cancelar</button><button class="btn btn-fire" (click)="save()">Salvar</button></div>
  </div>
</div>
`})
export class CategoriasComponent implements OnInit {
  modal = false;
  categorias: AdminCategoria[] = [];
  form: AdminCategoria = this.empty();

  constructor(private toast: ToastService, private store: AdminStore) {}

  ngOnInit() { this.reload(); }
  reload() { this.categorias = this.store.categorias.list(); }

  empty(): AdminCategoria { return { id: 0, emoji: '🍽', nome: '', descricao: '', ordem: this.categorias.length + 1, status: 'ATIVO' }; }
  openNew() { this.form = this.empty(); this.modal = true; }
  openEdit(c: AdminCategoria) { this.form = { ...c }; this.modal = true; }

  save() {
    if (!this.form.nome.trim()) { this.toast.error('Informe o nome da categoria.'); return; }
    this.store.categorias.save(this.form);
    this.modal = false;
    this.reload();
    this.toast.success('Categoria salva!');
  }

  remove(c: AdminCategoria) {
    this.store.categorias.remove(c.id);
    this.reload();
    this.toast.success('Categoria removida.');
  }
}

@Component({ selector:'app-estoque', template:`
<div class="admin-layout"><app-sidebar></app-sidebar>
  <div class="admin-content">
    <div class="admin-topbar"><h2>Movimentações de Estoque</h2><div class="spacer"></div><button class="btn btn-fire btn-sm" (click)="openNew()">+ Saída Manual</button></div>
    <div class="admin-inner">
      <div class="table-wrap">
        <table><thead><tr><th>Data/Hora</th><th>Ingrediente</th><th>Tipo</th><th>Qtd</th><th>Motivo</th><th>Referência</th><th>Usuário</th></tr></thead>
        <tbody>
          <tr *ngFor="let m of movs">
            <td class="font-mono text-xs text-muted">{{ m.data }}</td>
            <td>{{ m.ingrediente }}</td>
            <td><span class="tag" [ngClass]="tipoCls(m.tipo)">{{ m.tipo }}</span></td>
            <td class="font-mono">{{ m.qtd > 0 ? '+' : '' }}{{ m.qtd }}</td>
            <td>{{ m.motivo }}</td>
            <td class="text-muted">{{ m.referencia }}</td>
            <td class="text-muted">{{ m.usuario }}</td>
          </tr>
          <tr *ngIf="movs.length === 0"><td colspan="7" class="text-muted" style="text-align:center;padding:24px">Nenhuma movimentação registrada.</td></tr>
        </tbody></table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" [class.open]="modal" (click)="modal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>📦 Saída Manual de Estoque</h3><button class="modal-close" (click)="modal=false">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Ingrediente *</label><select class="form-select" [(ngModel)]="form.ingrediente"><option *ngFor="let i of ingredientes" [value]="i.nome">{{ i.nome }}</option></select></div>
      <div class="form-grid form-grid-2" style="margin-top:12px">
        <div class="form-group"><label class="form-label">Quantidade *</label><input type="number" class="form-input" placeholder="0" [(ngModel)]="form.qtd"></div>
        <div class="form-group"><label class="form-label">Motivo *</label><select class="form-select" [(ngModel)]="form.motivo"><option>DESPERDICIO</option><option>VENCIMENTO</option><option>QUEBRA</option><option>USO_INTERNO</option></select></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" (click)="modal=false">Cancelar</button><button class="btn btn-fire" (click)="save()">Registrar</button></div>
  </div>
</div>
`})
export class EstoqueComponent implements OnInit {
  modal = false;
  movs: AdminMovimentacao[] = [];
  ingredientes: AdminIngrediente[] = [];
  form = { ingrediente: '', qtd: 0, motivo: 'DESPERDICIO' };

  constructor(private toast: ToastService, private store: AdminStore) {}

  ngOnInit() { this.reload(); this.ingredientes = this.store.ingredientes.list(); }
  reload() { this.movs = this.store.movimentacoes.list(); }

  openNew() {
    this.form = { ingrediente: this.ingredientes[0]?.nome ?? '', qtd: 0, motivo: 'DESPERDICIO' };
    this.modal = true;
  }

  save() {
    if (!this.form.ingrediente) { this.toast.error('Selecione um ingrediente.'); return; }
    const qtd = Number(this.form.qtd);
    if (!qtd || qtd <= 0) { this.toast.error('Informe uma quantidade válida.'); return; }

    // Saída manual reduz o saldo do ingrediente correspondente.
    const ing = this.ingredientes.find(i => i.nome === this.form.ingrediente);
    if (ing) { this.store.ingredientes.save({ ...ing, saldo: ing.saldo - qtd }); }

    this.store.movimentacoes.save({
      id: 0,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ingrediente: this.form.ingrediente,
      tipo: 'SAÍDA',
      qtd: -qtd,
      motivo: this.form.motivo,
      referencia: '—',
      usuario: 'Admin'
    } as AdminMovimentacao);

    this.modal = false;
    this.reload();
    this.toast.success('Saída registrada no estoque!');
  }

  tipoCls(tipo: string) { return tipo === 'ENTRADA' ? 'tag-green' : tipo === 'PERDA' ? 'tag-amber' : 'tag-red'; }
}
