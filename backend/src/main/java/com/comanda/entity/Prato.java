package com.comanda.entity;

import com.comanda.enums.StatusPrato;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pratos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Prato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String emoji;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(precision = 10, scale = 4)
    private BigDecimal custo;

    private Integer tempoPreparo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPrato status = StatusPrato.ATIVO;
}
