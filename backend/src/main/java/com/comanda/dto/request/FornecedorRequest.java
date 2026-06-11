package com.comanda.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FornecedorRequest {
    @NotBlank
    private String razaoSocial;
    @NotBlank
    private String cnpj;
    private String telefone;
    private String email;
}
