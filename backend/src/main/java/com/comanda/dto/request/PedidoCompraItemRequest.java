package com.comanda.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PedidoCompraItemRequest {
    @NotNull
    private Long ingredienteId;
    @NotNull @Positive
    private BigDecimal quantidade;
    @NotNull @Positive
    private BigDecimal precoUnitario;
}
