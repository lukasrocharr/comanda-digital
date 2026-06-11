package com.comanda.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FichaTecnicaItemRequest {
    @NotNull
    private Long ingredienteId;
    @NotNull @Positive
    private BigDecimal quantidade;
    private BigDecimal fatorCorrecao = BigDecimal.ONE;
}
