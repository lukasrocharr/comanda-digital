package com.comanda.dto.response;

import com.comanda.enums.StatusCategoria;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class CategoriaResponse {
    private Long id;
    private String nome;
    private String descricao;
    private Integer ordem;
    private StatusCategoria status;
}
