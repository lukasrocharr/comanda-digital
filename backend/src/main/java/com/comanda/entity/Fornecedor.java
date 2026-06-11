package com.comanda.entity;

import com.comanda.enums.StatusFornecedor;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fornecedores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Fornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    private String telefone;

    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusFornecedor status = StatusFornecedor.ATIVO;

    @OneToMany(mappedBy = "fornecedor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.List<FornecedorProduto> produtos = new java.util.ArrayList<>();
}
