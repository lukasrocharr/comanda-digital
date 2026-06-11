package com.comanda.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FornecedorProdutoRequest {
    @NotNull
    private Long ingredienteId;

    @NotNull
    @DecimalMin(value = "0.01", inclusive = true)
    private BigDecimal preco;
}
