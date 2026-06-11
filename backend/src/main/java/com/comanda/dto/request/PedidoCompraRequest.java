package com.comanda.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PedidoCompraRequest {
    @NotNull
    private Long fornecedorId;
    @NotEmpty
    private List<PedidoCompraItemRequest> itens;
}
