package com.comanda.dto.request;

import com.comanda.enums.StatusPrato;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PratoRequest {
    @NotBlank
    private String nome;
    private String descricao;
    private String emoji;
    private Long categoriaId;
    @NotNull @Positive
    private BigDecimal preco;
    private Integer tempoPreparo;
    private StatusPrato status = StatusPrato.ATIVO;
}
