import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'comanda-auth-token';
  // E-mails autorizados a acessar o painel administrativo.
  private readonly adminEmails = ['admin@comanda.com', 'admin@email.com'];
  private readonly tokenSubject = new BehaviorSubject<string | null>(this.loadToken());
  token$ = this.tokenSubject.asObservable();

  private get rawToken(): string | null {
    return this.tokenSubject.value;
  }

  get token(): string | null {
    const token = this.rawToken;
    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload || this.isTokenExpired(payload)) {
      this.setToken(null);
      return null;
    }

    return token;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  /** E-mail do usuário autenticado, extraído do JWT. */
  get email(): string | null {
    const payload = this.decodeToken(this.rawToken);
    const value = payload?.['email'] ?? payload?.['sub'] ?? null;
    return typeof value === 'string' ? value.toLowerCase() : null;
  }

  /** Nome de exibição do usuário: usa o claim de nome do JWT ou, na falta, a parte local do e-mail. */
  get displayName(): string | null {
    if (!this.isAuthenticated) {
      return null;
    }
    const payload = this.decodeToken(this.rawToken);
    const nome = payload?.['nome'] ?? payload?.['name'];
    if (typeof nome === 'string' && nome.trim()) {
      return nome.trim();
    }
    const email = this.email;
    return email ? email.split('@')[0] : null;
  }

  /** Somente o administrador (por papel no token ou e-mail autorizado) tem acesso ao painel. */
  get isAdmin(): boolean {
    if (!this.isAuthenticated) {
      return false;
    }

    const payload = this.decodeToken(this.rawToken);
    if (payload) {
      const claims = [payload['role'], payload['perfil'], payload['roles'], payload['authorities'], payload['scope']];
      const roleText = claims
        .filter(v => v != null)
        .map(v => (Array.isArray(v) ? v.join(',') : String(v)))
        .join(',')
        .toUpperCase();
      if (roleText.includes('ADMIN')) {
        return true;
      }
    }

    const email = this.email;
    return !!email && this.adminEmails.includes(email);
  }

  /** Decodifica o payload do JWT sem validar a assinatura (validação é feita no backend). */
  private decodeToken(token: string | null): Record<string, any> | null {
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(normalized)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private isTokenExpired(payload: Record<string, any>): boolean {
    const exp = payload['exp'];
    if (!exp || typeof exp !== 'number') {
      return false;
    }
    return Date.now() >= exp * 1000;
  }

  setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(this.storageKey, token);
      this.tokenSubject.next(token);
    } else {
      localStorage.removeItem(this.storageKey);
      this.tokenSubject.next(null);
    }
  }

  logout(): void {
    this.setToken(null);
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }
}
