package com.comanda.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class PedidoRequest {
    @NotEmpty
    private List<PedidoItemRequest> itens;
    private String endereco;
}
