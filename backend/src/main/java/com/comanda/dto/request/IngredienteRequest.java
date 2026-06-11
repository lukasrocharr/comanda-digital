package com.comanda.dto.request;

import com.comanda.enums.UnidadeMedida;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class IngredienteRequest {
    @NotBlank
    private String nome;
    @NotBlank
    private String sku;
    @NotNull
    private UnidadeMedida unidade;
    @NotNull @Positive
    private BigDecimal estoqueMinimo;
    @NotNull @Positive
    private BigDecimal custoUnitario;
}
