package com.comanda.repository;

import com.comanda.entity.PedidoCompraItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoCompraItemRepository extends JpaRepository<PedidoCompraItem, Long> {
    List<PedidoCompraItem> findByPedidoCompra_Id(Long pedidoCompraId);
}
