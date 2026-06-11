package com.comanda.repository;

import com.comanda.entity.Pedido;
import com.comanda.enums.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByCliente_IdOrderByCriadoEmDesc(Long clienteId);
    List<Pedido> findByStatusIn(List<StatusPedido> statuses);
    List<Pedido> findByStatusOrderByCriadoEmAsc(StatusPedido status);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.criadoEm >= :inicio AND p.criadoEm < :fim AND p.status != 'CANCELADO'")
    BigDecimal somarTotalPorPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.criadoEm >= :inicio AND p.criadoEm < :fim AND p.status != 'CANCELADO'")
    long contarPorPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    List<Pedido> findByCriadoEmBetweenAndStatusNot(LocalDateTime inicio, LocalDateTime fim, StatusPedido status);
}
