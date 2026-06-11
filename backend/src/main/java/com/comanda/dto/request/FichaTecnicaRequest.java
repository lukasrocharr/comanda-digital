package com.comanda.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class FichaTecnicaRequest {
    @NotNull
    private Long pratoId;
    private Integer rendimento = 1;
    private Integer tempoPreparo;
    private String modoPreparo;
    private List<FichaTecnicaItemRequest> itens;
}
