package com.comanda.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PedidoItemRequest {
    @NotNull
    private Long pratoId;
    @Min(1)
    private int quantidade;
    private String obs;
}
