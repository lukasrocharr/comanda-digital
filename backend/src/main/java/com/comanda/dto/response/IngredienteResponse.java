package com.comanda.dto.response;

import com.comanda.enums.StatusEstoque;
import com.comanda.enums.UnidadeMedida;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data @Builder
public class IngredienteResponse {
    private Long id;
    private String nome;
    private String sku;
    private UnidadeMedida unidade;
    private BigDecimal saldoAtual;
    private BigDecimal estoqueMinimo;
    private BigDecimal custoUnitario;
    private StatusEstoque status;
    private Double percentualEstoque;
}
