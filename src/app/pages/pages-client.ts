import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, PedidoResponse } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { CartService, ToastService } from '../services/services';

@Component({ selector:'app-home', template:`
<app-navbar></app-navbar>
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-grid-bg"></div>
  <div class="hero-content">
    <div>
      <div class="hero-eyebrow">🔥 Dark Kitchen — Delivery Premium</div>
      <h1 class="hero-title">COMIDA<br><span style="color:var(--fire)">DE VERDADE</span><br>NO SEU RITMO</h1>
      <p class="hero-subtitle">Hambúrgueres artesanais, açaí cremoso e muito mais. Feito na hora, entregue com rastreamento em tempo real.</p>
      <div class="hero-actions">
        <button class="btn btn-fire btn-lg" routerLink="/cardapio">Ver Cardápio →</button>
        <button class="btn btn-outline btn-lg" routerLink="/login">Fazer Pedido</button>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-card-mini"><div class="hcm-emoji">🍔</div><div class="hcm-name">Burger Artesanal</div><div class="hcm-price">R$ 39,90</div></div>
      <div class="hero-card-mini"><div class="hcm-emoji">🍣</div><div class="hcm-name">Bowl Asiático</div><div class="hcm-price">R$ 32,90</div></div>
      <div class="hero-card-mini"><div class="hcm-emoji">🍦</div><div class="hcm-name">Açaí 500ml</div><div class="hcm-price">R$ 22,90</div></div>
      <div class="hero-card-mini"><div class="hcm-emoji">🌮</div><div class="hcm-name">Wrap Crocante</div><div class="hcm-price">R$ 28,90</div></div>
    </div>
  </div>
</section>
`})
export class HomeComponent {}

@Component({ selector:'app-login', template:`
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(ellipse at 30% 60%,rgba(255,92,26,.06) 0%,transparent 60%)">
  <div style="width:100%;max-width:420px">
    <div style="text-align:center;margin-bottom:32px">
      <div style="font-family:var(--font-hero);font-size:40px;color:var(--fire);margin-bottom:8px">🔥 COMANDA</div>
      <p class="text-muted">Bem-vindo de volta! Faça login para continuar.</p>
    </div>
    <div class="card">
      <div class="card-body" style="gap:20px;display:flex;flex-direction:column">
        <div class="form-group"><label class="form-label">E-mail</label><input type="email" class="form-input" placeholder="seu@email.com" [(ngModel)]="email"></div>
        <div class="form-group"><label class="form-label">Senha</label><input type="password" class="form-input" placeholder="••••••••" [(ngModel)]="senha"></div>
        <button class="btn btn-fire btn-full btn-lg" (click)="doLogin()">Entrar →</button>
        <div class="divider" style="margin:4px 0"></div>
        <div style="text-align:center;font-size:13px;color:var(--text2)">
          Não tem conta? <a routerLink="/register" style="color:var(--fire);font-weight:600">Criar agora</a>
        </div>
      </div>
    </div>
  </div>
</div>
`})
export class LoginComponent {
  email = '';
  senha = '';
  loading = false;

  constructor(
    private router: Router,
    private toast: ToastService,
    private api: ApiService,
    private auth: AuthService
  ) {}

  doLogin() {
    if (!this.email || !this.senha) {
      this.toast.error('Preencha e-mail e senha.');
      return;
    }

    this.auth.logout();
    this.loading = true;
    this.api.login({ email: this.email, senha: this.senha }).subscribe({
      next: resp => {
        this.auth.setToken(resp.token);
        if (this.auth.isAdmin) {
          this.toast.success('Login de administrador realizado!');
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.toast.success('Login realizado!');
          this.router.navigate(['/cardapio']);
        }
        this.loading = false;
      },
      error: () => {
        this.toast.error('Falha no login. Verifique suas credenciais.');
        this.loading = false;
      }
    });
  }
}

@Component({ selector:'app-register', template:`
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px">
  <div style="width:100%;max-width:480px">
    <div style="text-align:center;margin-bottom:28px">
      <div style="font-family:var(--font-hero);font-size:38px;color:var(--fire)">🔥 COMANDA</div>
      <p class="text-muted mt-4">Crie sua conta e peça agora mesmo</p>
    </div>
    <div class="card">
      <div class="card-body" style="gap:18px;display:flex;flex-direction:column">
        <div class="form-grid form-grid-2">
          <div class="form-group"><label class="form-label">Nome completo</label><input type="text" class="form-input" placeholder="João Silva" [(ngModel)]="nome"></div>
          <div class="form-group"><label class="form-label">Telefone</label><input type="text" class="form-input" placeholder="(11) 99999-0000" [(ngModel)]="telefone"></div>
        </div>
        <div class="form-group"><label class="form-label">E-mail</label><input type="email" class="form-input" placeholder="seu@email.com" [(ngModel)]="email"></div>
        <div class="form-group"><label class="form-label">Endereço de entrega</label><input type="text" class="form-input" placeholder="Rua, número, bairro, cidade" [(ngModel)]="endereco"></div>
        <div class="form-grid form-grid-2">
          <div class="form-group"><label class="form-label">Senha</label><input type="password" class="form-input" placeholder="••••••••" [(ngModel)]="senha"></div>
          <div class="form-group"><label class="form-label">Confirmar senha</label><input type="password" class="form-input" placeholder="••••••••" [(ngModel)]="confirmSenha"></div>
        </div>
        <button class="btn btn-fire btn-full btn-lg" [disabled]="loading" (click)="doRegister()">Criar Conta →</button>
        <div style="text-align:center;font-size:13px;color:var(--text2)">
          Já tem conta? <a routerLink="/login" style="color:var(--fire);font-weight:600">Fazer login</a>
        </div>
      </div>
    </div>
  </div>
</div>
`})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';
  confirmSenha = '';
  telefone = '';
  endereco = '';
  loading = false;

  constructor(
    private router: Router,
    private toast: ToastService,
    private api: ApiService,
    private auth: AuthService
  ) {}

  doRegister() {
    if (!this.nome || !this.email || !this.senha || !this.confirmSenha) {
      this.toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (this.senha !== this.confirmSenha) {
      this.toast.error('As senhas não coincidem.');
      return;
    }

    this.loading = true;
    this.api.register({
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      telefone: this.telefone,
      endereco: this.endereco
    }).subscribe({
      next: resp => {
        this.auth.setToken(resp.token);
        this.toast.success('Conta criada com sucesso!');
        this.router.navigate(['/cardapio']);
      },
      error: () => {
        this.toast.error('Não foi possível criar sua conta.');
        this.loading = false;
      }
    });
  }
}

@Component({ selector:'app-pedido-status', template:`
<nav class="nav-client">
  <div class="nav-logo" routerLink="/"><span>🔥</span> COMANDA</div>
  <div class="nav-links">
    <button class="nav-btn" routerLink="/pedidos">Meus Pedidos</button>
    <button class="nav-btn" routerLink="/cardapio">Novo Pedido</button>
  </div>
</nav>
<div style="padding:40px 24px 60px;max-width:760px;margin:0 auto">
  <div *ngIf="loading" style="text-align:center;padding:60px 0">Carregando status...</div>
  <div *ngIf="!loading && !order" class="empty-state">
    <div class="empty-icon">📦</div><p>Nenhum pedido encontrado.</p>
    <button class="btn btn-fire" routerLink="/cardapio">Ver cardápio</button>
  </div>
  <div *ngIf="!loading && order" class="order-status-card">
    <div class="order-id">PEDIDO #{{ order.id }}</div>
    <div class="order-big-status">{{ order.status }}</div>
    <div class="timeline">
      <div class="timeline-step" [class.done]="order.status === 'PAGO' || order.status === 'RECEBIDO' || order.status === 'EM_PREPARO' || order.status === 'PRONTO'"><div class="timeline-dot">✓</div><div class="timeline-label">Recebido</div></div>
      <div class="timeline-step" [class.done]="order.status === 'PAGO' || order.status === 'EM_PREPARO' || order.status === 'PRONTO'"><div class="timeline-dot">✓</div><div class="timeline-label">Confirmado</div></div>
      <div class="timeline-step" [class.current]="order.status === 'EM_PREPARO' || order.status === 'PRONTO'"><div class="timeline-dot">⚙</div><div class="timeline-label">Em Preparo</div></div>
      <div class="timeline-step" [class.done]="order.status === 'PRONTO'"><div class="timeline-dot">✓</div><div class="timeline-label">Pronto</div></div>
      <div class="timeline-step"><div class="timeline-dot">•</div><div class="timeline-label">Saiu p/ Entrega</div></div>
    </div>
    <div class="divider"></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div *ngFor="let item of order.itens" style="display:flex;gap:8px;font-size:13.5px">
        <span class="pedido-item-qty">{{ item.quantidade }}x</span>
        <span>{{ item.pratoNome }}</span>
        <span class="ml-auto font-mono text-sm">R$ {{ item.subtotal | number:'1.2-2' }}</span>
      </div>
    </div>
    <div class="divider"></div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span class="text-muted">Total pago</span>
      <span class="font-hero" style="font-size:28px;color:var(--fire)">R$ {{ order.total | number:'1.2-2' }}</span>
    </div>
    <div style="margin-top:16px;padding:12px;background:var(--surface2);border-radius:var(--radius);font-size:12.5px;color:var(--text2)">
      Endereço: {{ order.endereco }}<br>
      Pedido criado em: {{ order.criadoEm | date:'short' }}
    </div>
  </div>
</div>
`})
export class PedidoStatusComponent implements OnInit {
  order: PedidoResponse | null = null;
  loading = true;

  constructor(private orders: OrderService) {}

  ngOnInit() {
    this.order = this.orders.latest();
    this.loading = false;
  }
}

@Component({ selector:'app-meus-pedidos', template:`
<nav class="nav-client">
  <div class="nav-logo" routerLink="/"><span>🔥</span> COMANDA</div>
  <div class="nav-links"><button class="nav-btn" routerLink="/cardapio">Novo Pedido</button></div>
</nav>
<div class="container" style="padding-top:36px;padding-bottom:60px">
  <h1 class="section-title" style="margin-bottom:28px">Meus Pedidos</h1>
  <div *ngIf="loading" style="text-align:center;padding:60px 0">Carregando pedidos...</div>
  <div *ngIf="!loading && pedidos.length === 0" class="empty-state">
    <div class="empty-icon">📦</div><p>Você ainda não tem pedidos.</p>
    <button class="btn btn-fire" routerLink="/cardapio" style="margin-top:16px">Ver Cardápio</button>
  </div>
  <div *ngIf="!loading && pedidos.length > 0" style="display:flex;flex-direction:column;gap:14px">
    <div *ngFor="let pedido of pedidos" class="card" style="cursor:pointer" [routerLink]="['/status']">
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <div>
            <div class="font-mono text-xs text-muted">#{{ pedido.id }}</div>
            <div style="font-size:15px;font-weight:600;margin-top:2px">{{ pedido.itens.length }} itens • {{ pedido.endereco }}</div>
            <div class="text-xs text-muted mt-4">{{ pedido.criadoEm | date:'short' }}</div>
          </div>
          <div class="ml-auto" style="display:flex;align-items:center;gap:16px">
            <span class="font-hero" style="font-size:22px;color:var(--fire)">R$ {{ pedido.total | number:'1.2-2' }}</span>
            <span class="tag" [ngClass]="statusClass(pedido.status)">{{ pedido.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`})
export class MeusPedidosComponent implements OnInit {
  pedidos: PedidoResponse[] = [];
  loading = true;

  constructor(private orders: OrderService) {}

  ngOnInit() {
    this.pedidos = this.orders.list();
    this.loading = false;
  }

  statusClass(status: string) {
    return status === 'EM_PREPARO' ? 'tag-fire' : status === 'PRONTO' || status === 'PAGO' ? 'tag-green' : status === 'RECEBIDO' ? 'tag-amber' : 'tag-gray';
  }
}
