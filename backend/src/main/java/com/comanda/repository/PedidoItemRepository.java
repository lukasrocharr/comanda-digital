package com.comanda.repository;

import com.comanda.entity.PedidoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {

    @Query("SELECT pi.prato.nome, SUM(pi.quantidade) as total FROM PedidoItem pi " +
           "JOIN pi.pedido p WHERE p.status != 'CANCELADO' " +
           "GROUP BY pi.prato.id ORDER BY total DESC")
    List<Object[]> findTopPratos();
}
