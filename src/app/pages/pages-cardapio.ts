import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PRATOS, Prato, CartService, ToastService } from '../services/services';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';

@Component({ selector:'app-cardapio', template:`
<app-navbar></app-navbar>
<div class="container" style="padding-top:36px;padding-bottom:60px">
  <div style="display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:24px">
    <div><h1 class="section-title">Cardápio</h1><p class="text-muted text-sm mt-4">Escolha seus favoritos e monte seu pedido</p></div>
    <div class="ml-auto"><div class="search-wrap"><span class="search-icon">🔍</span><input type="text" class="search-input" placeholder="Buscar prato..." [(ngModel)]="search" (ngModelChange)="filter()"></div></div>
  </div>
  <div class="cat-pills" style="margin-bottom:28px">
    <button class="cat-pill" [class.active]="cat=='all'"        (click)="setCat('all')">Todos</button>
    <button class="cat-pill" [class.active]="cat=='lanches'"    (click)="setCat('lanches')">🍔 Lanches</button>
    <button class="cat-pill" [class.active]="cat=='acai'"       (click)="setCat('acai')">🍦 Açaí</button>
    <button class="cat-pill" [class.active]="cat=='asiaticos'"  (click)="setCat('asiaticos')">🍣 Asiáticos</button>
    <button class="cat-pill" [class.active]="cat=='bebidas'"    (click)="setCat('bebidas')">🥤 Bebidas</button>
    <button class="cat-pill" [class.active]="cat=='wraps'"      (click)="setCat('wraps')">🌮 Wraps</button>
  </div>
  <div class="cardapio-grid">
    <div *ngFor="let p of filtered" class="prato-card" [routerLink]="['/cardapio', p.id]">
      <div class="prato-img">{{ p.emoji }}</div>
      <div class="prato-body">
        <div class="prato-category">{{ p.cat.toUpperCase() }}</div>
        <div class="prato-name">{{ p.nome }}</div>
        <div class="prato-desc">{{ p.desc | slice:0:80 }}...</div>
        <div class="prato-footer">
          <span class="prato-price">R$ {{ p.preco | number:'1.2-2' }}</span>
          <span class="prato-time">⏱ {{ p.tempo }} min</span>
        </div>
      </div>
    </div>
    <div *ngIf="filtered.length === 0" class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🍽</div><p>Nenhum prato encontrado</p>
    </div>
  </div>
</div>
`})
export class CardapioComponent implements OnInit {
  cat = 'all'; search = '';
  all: Prato[] = []; filtered: Prato[] = [];
  
  constructor(private api: ApiService) {}
  
  ngOnInit() { 
    this.api.listPratos().subscribe(pratos => {
      this.all = pratos;
      this.filter();
    });
  }
  
  setCat(c: string) { this.cat = c; this.filter(); }
  
  filter() {
    this.filtered = this.all.filter((p: Prato) =>
      (this.cat === 'all' || p.cat === this.cat) &&
      (!this.search || p.nome.toLowerCase().includes(this.search.toLowerCase()))
    );
  }
}

@Component({ selector:'app-prato-detalhe', template:`
<app-navbar></app-navbar>
<div class="container" style="padding-top:40px;padding-bottom:60px;max-width:700px">
  <button class="btn btn-ghost btn-sm" routerLink="/cardapio" style="margin-bottom:24px">← Cardápio</button>
  <ng-container *ngIf="prato">
    <div class="prato-img" style="height:240px;border-radius:var(--radius-lg);font-size:72px;margin-bottom:24px">{{ prato.emoji }}</div>
    <div class="label" style="margin-bottom:8px">{{ prato.cat.toUpperCase() }}</div>
    <h1 style="font-family:var(--font-hero);font-size:48px;line-height:1;margin-bottom:16px">{{ prato.nome }}</h1>
    <p style="font-size:16px;color:var(--text2);line-height:1.7;margin-bottom:24px">{{ prato.desc }}</p>
    <div style="display:flex;align-items:center;gap:24px;margin-bottom:32px;flex-wrap:wrap">
      <span style="font-family:var(--font-hero);font-size:44px;color:var(--fire)">R$ {{ prato.preco | number:'1.2-2' }}</span>
      <span class="tag tag-gray">⏱ {{ prato.tempo }} min</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;max-width:320px">
      <div class="form-group">
        <label class="form-label">Quantidade</label>
        <div style="display:flex;align-items:center;gap:12px">
          <button class="qty-btn" (click)="qty=qty>1?qty-1:1">−</button>
          <span style="font-size:22px;font-weight:600;min-width:36px;text-align:center">{{ qty }}</span>
          <button class="qty-btn" (click)="qty=qty+1">+</button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Observações (opcional)</label><input type="text" class="form-input" placeholder="Ex: sem cebola..." [(ngModel)]="obs"></div>
      <button class="btn btn-fire btn-lg" (click)="addToCart()">🛒 Adicionar {{ qty }}x — R$ {{ prato.preco * qty | number:'1.2-2' }}</button>
    </div>
  </ng-container>
</div>
`})
export class PratoDetalheComponent implements OnInit {
  prato?: Prato; qty = 1; obs = '';
  constructor(private route: ActivatedRoute, private cart: CartService, private toast: ToastService, private router: Router, private api: ApiService) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getPrato(id).subscribe(prato => {
      this.prato = prato || undefined;
      if (!this.prato) this.router.navigate(['/cardapio']);
    });
  }
  addToCart() {
    if (!this.prato) return;
    this.cart.add(this.prato, this.qty, this.obs);
    this.toast.success(this.qty + 'x ' + this.prato.nome + ' adicionado!');
    this.router.navigate(['/cardapio']);
  }
}

@Component({ selector:'app-checkout', template:`
<nav class="nav-client">
  <div class="nav-logo" routerLink="/"><span>🔥</span> COMANDA</div>
  <div class="nav-links"><button class="nav-btn" routerLink="/cardapio">← Cardápio</button></div>
</nav>
<div class="container" style="padding-top:40px;padding-bottom:60px;max-width:900px">
  <h1 class="section-title" style="margin-bottom:28px">Finalizar Pedido</h1>
  <div *ngIf="cart.count === 0" class="empty-state">
    <div class="empty-icon">🛒</div><p>Carrinho vazio</p>
    <button class="btn btn-fire" routerLink="/cardapio" style="margin-top:16px">Ver Cardápio</button>
  </div>
  <div *ngIf="cart.count > 0" style="display:grid;grid-template-columns:1fr 380px;gap:24px;align-items:start">
    <div style="display:flex;flex-direction:column;gap:20px">
      <div class="card">
        <div class="card-header"><span>📍</span><h3>Endereço de Entrega</h3></div>
        <div class="card-body">
          <div class="form-group"><input type="text" class="form-input" placeholder="Rua, número, bairro, cidade" [(ngModel)]="endereco"></div>
          <div class="form-grid form-grid-2 mt-8">
            <div class="form-group"><label class="form-label">Complemento</label><input type="text" class="form-input" placeholder="Apto, bloco..." [(ngModel)]="complemento"></div>
            <div class="form-group"><label class="form-label">Referência</label><input type="text" class="form-input" placeholder="Perto do mercado..." [(ngModel)]="referencia"></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span>💳</span><h3>Pagamento (Simulado)</h3></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
          <label *ngFor="let p of pagamentos" style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:14px;background:var(--surface2);border-radius:var(--radius);"
            [style.border]="pagto===p.id ? '1.5px solid var(--fire)' : '1.5px solid var(--border)'"
            (click)="pagto=p.id">
            <input type="radio" name="pagto" [checked]="pagto===p.id" style="accent-color:var(--fire)">
            <span>{{ p.label }}</span>
          </label>
        </div>
      </div>
    </div>
    <div style="position:sticky;top:80px">
      <div class="card">
        <div class="card-header"><span>🧾</span><h3>Resumo</h3></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:10px">
          <div *ngFor="let item of cart.items" style="display:flex;gap:8px;align-items:center;font-size:13px">
            <span style="font-size:20px">{{ item.emoji }}</span>
            <span>{{ item.qty }}x {{ item.nome }}</span>
            <span class="ml-auto font-mono">R$ {{ item.preco*item.qty | number:'1.2-2' }}</span>
          </div>
        </div>
        <div class="card-footer" style="flex-direction:column;gap:10px">
          <div style="display:flex;justify-content:space-between;width:100%"><span class="text-muted text-sm">Subtotal</span><span class="font-mono">R$ {{ cart.total | number:'1.2-2' }}</span></div>
          <div style="display:flex;justify-content:space-between;width:100%"><span class="text-muted text-sm">Entrega</span><span style="color:var(--green)" class="font-mono">Grátis</span></div>
          <div class="divider" style="margin:4px 0;width:100%"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;width:100%">
            <span style="font-weight:600">Total</span>
            <span class="font-hero" style="font-size:26px;color:var(--fire)">R$ {{ cart.total | number:'1.2-2' }}</span>
          </div>
          <button class="btn btn-fire btn-full btn-lg" (click)="confirmar()" [disabled]="loading">{{ loading ? 'Enviando pedido...' : '✅ Confirmar Pedido' }}</button>
        </div>
      </div>
    </div>
  </div>
</div>
`})
export class CheckoutComponent {
  pagto = 1;
  endereco = '';
  complemento = '';
  referencia = '';
  loading = false;
  pagamentos = [{ id:1, label:'💳 Cartão de Crédito/Débito' }, { id:2, label:'⚡ Pix' }, { id:3, label:'💵 Dinheiro na Entrega' }];

  constructor(
    public cart: CartService,
    private toast: ToastService,
    private router: Router,
    private auth: AuthService,
    private orders: OrderService
  ) {}

  confirmar() {
    if (this.cart.count === 0) {
      this.toast.error('O carrinho está vazio. Adicione itens antes de finalizar.');
      return;
    }

    if (!this.auth.isAuthenticated) {
      this.toast.error('Faça login para finalizar o pedido.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.endereco.trim()) {
      this.toast.error('Informe o endereço de entrega.');
      return;
    }

    const endereco = this.endereco.trim() + (this.complemento.trim() ? `, ${this.complemento.trim()}` : '');

    this.loading = true;
    this.orders.create(this.cart.items, endereco, this.auth.displayName ?? 'Cliente');
    this.toast.success('Pedido confirmado e pago! 🎉');
    this.cart.clear();
    this.loading = false;
    this.router.navigate(['/status']);
  }
}
