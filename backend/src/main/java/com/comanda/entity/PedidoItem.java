package com.comanda.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pedidos_itens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PedidoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prato_id", nullable = false)
    private Prato prato;

    @Column(nullable = false)
    private Integer quantidade;

    private String obs;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;
}
