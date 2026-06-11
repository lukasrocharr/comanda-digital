package com.comanda.dto.response;

import com.comanda.enums.MotivoMovimentacao;
import com.comanda.enums.TipoMovimentacao;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class MovimentacaoResponse {
    private Long id;
    private Long ingredienteId;
    private String ingredienteNome;
    private TipoMovimentacao tipo;
    private BigDecimal quantidade;
    private MotivoMovimentacao motivo;
    private String referencia;
    private String usuarioNome;
    private LocalDateTime criadoEm;
}
