package com.comanda.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoriaRequest {
    @NotBlank
    private String nome;
    private String descricao;
    private Integer ordem;
}
