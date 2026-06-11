import { Injectable } from '@angular/core';
import { PedidoResponse } from './api.service';
import { CartItem } from './services';

/**
 * Armazena os pedidos do cliente localmente (sem backend).
 * Como o sistema é apenas demonstrativo, o pedido é finalizado no próprio
 * navegador e persistido em localStorage.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storageKey = 'comanda-pedidos';

  list(): PedidoResponse[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as PedidoResponse[] : [];
    } catch {
      return [];
    }
  }

  latest(): PedidoResponse | null {
    const list = this.list();
    return list.length ? list[0] : null;
  }

  create(items: CartItem[], endereco: string, clienteNome: string): PedidoResponse {
    const itens = items.map((item, idx) => ({
      id: idx + 1,
      pratoId: item.id,
      pratoNome: item.nome,
      pratoEmoji: item.emoji,
      quantidade: item.qty,
      obs: item.obs,
      precoUnitario: item.preco,
      subtotal: item.preco * item.qty
    }));

    const pedido: PedidoResponse = {
      id: Math.floor(Date.now() % 100000),
      clienteNome,
      clienteId: 0,
      status: 'PAGO',
      total: itens.reduce((s, i) => s + i.subtotal, 0),
      endereco,
      criadoEm: new Date().toISOString(),
      itens
    };

    localStorage.setItem(this.storageKey, JSON.stringify([pedido, ...this.list()]));
    return pedido;
  }

  updateStatus(id: number, status: string): PedidoResponse | null {
    const list = this.list();
    const pedido = list.find(p => p.id === id);
    if (!pedido) {
      return null;
    }
    pedido.status = status;
    localStorage.setItem(this.storageKey, JSON.stringify(list));
    return pedido;
  }
}
