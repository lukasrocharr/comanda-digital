import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService, ToastService, Toast } from '../services/services';
import { AuthService } from '../services/auth.service';

// ── NAVBAR (client) ────────────────────────────────────────────────
@Component({
  selector: 'app-navbar',
  template: `
    <nav class="nav-client">
      <div class="nav-logo" routerLink="/"><span>🔥</span> COMANDA</div>
      <div class="nav-links">
        <button class="nav-btn" [class.active-link]="url=='/'" routerLink="/">Início</button>
        <button class="nav-btn" [class.active-link]="url=='/cardapio'" routerLink="/cardapio">Cardápio</button>

        <ng-container *ngIf="!auth.isAuthenticated">
          <button class="nav-btn" routerLink="/login">Entrar</button>
          <button class="nav-btn cta" routerLink="/register">Criar Conta</button>
        </ng-container>

        <ng-container *ngIf="auth.isAuthenticated">
          <button *ngIf="auth.isAdmin" class="nav-btn" routerLink="/admin/dashboard">Painel</button>
          <button class="nav-btn" routerLink="/pedidos">Meus Pedidos</button>
          <span class="nav-user">👤 {{ auth.displayName }}</span>
          <button class="nav-btn" (click)="logout()">Sair</button>
        </ng-container>

        <button class="cart-badge" (click)="toggleCart()">
          🛒 Carrinho <span class="badge-count">{{ cart.count }}</span>
        </button>
      </div>
    </nav>
    <app-cart-drawer></app-cart-drawer>
  `,
  styles: [`
    .nav-user { font-size:14px; font-weight:600; color:var(--fire); display:flex; align-items:center; gap:6px; padding:0 4px; }
  `]
})
export class NavbarComponent implements OnInit {
  url = '/';
  constructor(public cart: CartService, public auth: AuthService, private router: Router) {}
  ngOnInit() {
    this.url = this.router.url;
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.url = e.url);
  }
  toggleCart() { document.getElementById('cartDrawer')?.classList.toggle('open'); }
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

// ── CART DRAWER ────────────────────────────────────────────────────
@Component({
  selector: 'app-cart-drawer',
  template: `
    <div class="cart-overlay" id="cartOverlay" (click)="close()"></div>
    <div class="cart-drawer" id="cartDrawer">
      <div class="cart-header">
        <h3>🛒 Carrinho</h3>
        <button class="cart-close" (click)="close()">✕</button>
      </div>
      <div class="cart-body">
        <div *ngIf="cart.items.length === 0" class="empty-state">
          <div class="empty-icon">🛒</div><p>Carrinho vazio</p>
        </div>
        <div *ngFor="let item of cart.items; let i = index" class="cart-item">
          <div style="font-size:28px">{{ item.emoji }}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">{{ item.nome }}</div>
            <div *ngIf="item.obs" class="cart-item-obs">📝 {{ item.obs }}</div>
            <div class="cart-item-controls">
              <button class="qty-btn" (click)="cart.changeQty(i,-1)">−</button>
              <span class="qty-val">{{ item.qty }}</span>
              <button class="qty-btn" (click)="cart.changeQty(i,1)">+</button>
            </div>
          </div>
          <div class="cart-item-price">R$ {{ (item.preco*item.qty) | number:'1.2-2' }}</div>
        </div>
      </div>
      <div class="cart-footer" *ngIf="cart.items.length > 0">
        <div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:12px;">
          <span class="text-muted">Total</span>
          <span style="font-family:var(--font-hero); font-size:22px; color:var(--fire);">R$ {{ cart.total | number:'1.2-2' }}</span>
        </div>
        <button class="btn btn-fire btn-full" (click)="goCheckout()">Finalizar Pedido →</button>
      </div>
    </div>
  `
})
export class CartDrawerComponent {
  constructor(public cart: CartService, private router: Router) {}
  close() { document.getElementById('cartDrawer')?.classList.remove('open'); }
  goCheckout() { this.close(); this.router.navigate(['/checkout']); }
}

// ── SIDEBAR (admin) ────────────────────────────────────────────────
@Component({
  selector: 'app-sidebar',
  template: `
    <div class="sidebar">
      <div class="sidebar-logo">
        <h1>🔥 COMANDA</h1>
        <p>PAINEL ADMINISTRATIVO</p>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">Visão Geral</div>
        <a class="sidebar-item" routerLink="/admin/dashboard" routerLinkActive="active"><span class="icon">📊</span> Dashboard</a>
        <a class="sidebar-item" routerLink="/admin/pedidos" routerLinkActive="active">
          <span class="icon">📋</span> Pedidos <span class="sidebar-badge">4</span>
        </a>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">Cardápio</div>
        <a class="sidebar-item" routerLink="/admin/pratos"     routerLinkActive="active"><span class="icon">🍽</span> Pratos</a>
        <a class="sidebar-item" routerLink="/admin/categorias" routerLinkActive="active"><span class="icon">🏷</span> Categorias</a>
        <a class="sidebar-item" routerLink="/admin/fichas"     routerLinkActive="active"><span class="icon">📝</span> Fichas Técnicas</a>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">Estoque</div>
        <a class="sidebar-item" routerLink="/admin/ingredientes" routerLinkActive="active">
          <span class="icon">🥗</span> Ingredientes <span class="sidebar-badge">3</span>
        </a>
        <a class="sidebar-item" routerLink="/admin/estoque" routerLinkActive="active"><span class="icon">📦</span> Movimentações</a>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">Compras</div>
        <a class="sidebar-item" routerLink="/admin/fornecedores" routerLinkActive="active"><span class="icon">🏭</span> Fornecedores</a>
        <a class="sidebar-item" routerLink="/admin/compras"      routerLinkActive="active"><span class="icon">🛒</span> Pedidos de Compra</a>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">Sistema</div>
        <a class="sidebar-item" routerLink="/admin/usuarios" routerLinkActive="active"><span class="icon">👥</span> Usuários</a>
      </div>
      <div class="sidebar-bottom">
        <a class="sidebar-item" routerLink="/"><span class="icon">🚪</span> Sair</a>
      </div>
    </div>
  `
})
export class SidebarComponent {}

// ── TOAST ──────────────────────────────────────────────────────────
@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-wrap">
      <div *ngFor="let t of toasts" class="toast" [ngClass]="'toast-'+t.type">
        <span>{{ t.type==='success' ? '✅' : t.type==='error' ? '❌' : '🔥' }}</span>
        <span>{{ t.msg }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrap { position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:10px; pointer-events:none; }
    .toast { background:var(--surface2); border:1px solid var(--border2); border-radius:var(--radius); padding:12px 18px; font-size:13.5px; display:flex; align-items:center; gap:10px; box-shadow:var(--shadow); animation:slideInRight .3s ease; min-width:240px; }
    .toast-success { border-left:3px solid var(--green); }
    .toast-error   { border-left:3px solid var(--red); }
    .toast-info    { border-left:3px solid var(--fire); }
    @keyframes slideInRight { from { transform:translateX(60px); opacity:0; } to { transform:translateX(0); opacity:1; } }
  `]
})
export class ToastComponent {
  toasts: Toast[] = [];
  constructor(ts: ToastService) { ts.toasts$.subscribe(t => this.toasts = t); }
}

// ── MODAL wrapper helper ───────────────────────────────────────────
@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-overlay" [class.open]="open" (click)="onBg($event)">
      <div class="modal" [class.modal-lg]="lg" (click)="$event.stopPropagation()">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ModalComponent {
  open = false;
  lg = false;
  onBg(e: Event) { if (e.target === e.currentTarget) this.open = false; }
}
