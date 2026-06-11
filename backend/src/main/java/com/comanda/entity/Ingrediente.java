package com.comanda.entity;

import com.comanda.enums.StatusEstoque;
import com.comanda.enums.UnidadeMedida;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ingredientes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ingrediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String sku;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnidadeMedida unidade;

    @Column(nullable = false)
    private BigDecimal saldoAtual = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal estoqueMinimo;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal custoUnitario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEstoque status = StatusEstoque.OK;
}
