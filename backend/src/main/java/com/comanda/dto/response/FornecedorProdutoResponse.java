package com.comanda.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class FornecedorProdutoResponse {
    private Long id;
    private Long fornecedorId;
    private String fornecedorNome;
    private Long ingredienteId;
    private String ingredienteNome;
    private BigDecimal preco;
}
