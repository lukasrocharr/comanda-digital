import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Prato {
  id: number; nome: string; cat: string; emoji: string;
  desc: string; preco: number; tempo: number; destaque?: boolean;
}

export interface CartItem extends Prato { qty: number; obs: string; }

export const PRATOS: Prato[] = [
  { id:1, nome:'Burger Artesanal', cat:'lanches', emoji:'🍔', desc:'180g de blend bovino premium, pão brioche, queijo cheddar, alface americana, tomate e molho especial da casa.', preco:39.90, tempo:12, destaque:true },
  { id:2, nome:'Açaí 500ml',       cat:'acai',    emoji:'🍦', desc:'Açaí cremoso com granola crocante, banana em rodelas e leite condensado. Gelado na hora.', preco:22.90, tempo:5 },
  { id:3, nome:'Bowl Asiático',    cat:'asiaticos',emoji:'🍣', desc:'Salmão grelhado, arroz japonês, edamame, cenoura, pepino e molho teriyaki artesanal.', preco:32.90, tempo:15 },
  { id:4, nome:'Wrap Crocante',    cat:'wraps',   emoji:'🌮', desc:'Frango crocante empanado, cream cheese, alface, tomate, milho e molho chipotle.', preco:28.90, tempo:10 },
  { id:5, nome:'Limonada Suíça',   cat:'bebidas', emoji:'🥤', desc:'Limonada cremosa com leite condensado, limão siciliano e hortelã. 500ml.', preco:12.90, tempo:3 },
  { id:6, nome:'Suco de Laranja',  cat:'bebidas', emoji:'🍊', desc:'Suco natural de laranja espremido na hora. 400ml.', preco:9.90, tempo:3 },
  { id:7, nome:'Smash Burger',     cat:'lanches', emoji:'🍔', desc:'Blend angus prensado, queijo americano derretido, picles crocante e molho smash.', preco:44.90, tempo:14 },
  { id:8, nome:'Açaí 300ml',       cat:'acai',    emoji:'🍦', desc:'Versão menor do nosso açaí premium. Ideal para quem quer matar a vontade.', preco:16.90, tempo:4 },
];

@Injectable({ providedIn: 'root' })
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.items$.asObservable();

  get items(): CartItem[] { return this.items$.value; }
  get count(): number { return this.items.reduce((s, i) => s + i.qty, 0); }
  get total(): number { return this.items.reduce((s, i) => s + i.preco * i.qty, 0); }

  add(prato: Prato, qty: number, obs: string): void {
    const list = [...this.items];
    const idx = list.findIndex(i => i.id === prato.id && i.obs === obs);
    if (idx >= 0) list[idx].qty += qty;
    else list.push({ ...prato, qty, obs });
    this.items$.next(list);
  }

  changeQty(idx: number, delta: number): void {
    const list = [...this.items];
    list[idx].qty += delta;
    if (list[idx].qty <= 0) list.splice(idx, 1);
    this.items$.next(list);
  }

  clear(): void { this.items$.next([]); }
}

// ── Toast ──────────────────────────────────────────────────────────
export interface Toast { id: number; msg: string; type: 'success'|'error'|'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private n = 0;
  private t$ = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.t$.asObservable();

  show(msg: string, type: Toast['type'] = 'info'): void {
    const id = ++this.n;
    this.t$.next([...this.t$.value, { id, msg, type }]);
    setTimeout(() => this.t$.next(this.t$.value.filter(t => t.id !== id)), 3000);
  }
  success(m: string) { this.show(m, 'success'); }
  error(m: string)   { this.show(m, 'error'); }
  info(m: string)    { this.show(m, 'info'); }
}
