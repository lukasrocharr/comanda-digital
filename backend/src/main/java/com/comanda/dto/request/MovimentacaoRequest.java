package com.comanda.dto.request;

import com.comanda.enums.MotivoMovimentacao;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MovimentacaoRequest {
    @NotNull
    private Long ingredienteId;
    @NotNull @Positive
    private BigDecimal quantidade;
    @NotNull
    private MotivoMovimentacao motivo;
}
