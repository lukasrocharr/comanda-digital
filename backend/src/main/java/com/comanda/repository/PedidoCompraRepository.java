package com.comanda.repository;

import com.comanda.entity.PedidoCompra;
import com.comanda.enums.StatusPedidoCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoCompraRepository extends JpaRepository<PedidoCompra, Long> {
    List<PedidoCompra> findByStatusOrderByCriadoEmDesc(StatusPedidoCompra status);
    List<PedidoCompra> findAllByOrderByCriadoEmDesc();
}
