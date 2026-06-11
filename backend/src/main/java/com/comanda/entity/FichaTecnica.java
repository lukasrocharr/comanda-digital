package com.comanda.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fichas_tecnicas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FichaTecnica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prato_id", unique = true, nullable = false)
    private Prato prato;

    private Integer rendimento = 1;

    private Integer tempoPreparo;

    @Column(columnDefinition = "TEXT")
    private String modoPreparo;

    @OneToMany(mappedBy = "fichaTecnica", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FichaTecnicaItem> itens = new ArrayList<>();
}
