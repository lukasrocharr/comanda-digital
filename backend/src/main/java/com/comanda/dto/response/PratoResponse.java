package com.comanda.dto.response;

import com.comanda.enums.StatusPrato;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data @Builder
public class PratoResponse {
    private Long id;
    private String nome;
    private String descricao;
    private String emoji;
    private CategoriaResponse categoria;
    private BigDecimal preco;
    private BigDecimal custo;
    private Integer tempoPreparo;
    private StatusPrato status;
    private Double foodCostPct;
}
