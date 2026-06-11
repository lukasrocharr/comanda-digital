package com.comanda.dto.response;

import com.comanda.enums.StatusFornecedor;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class FornecedorResponse {
    private Long id;
    private String razaoSocial;
    private String cnpj;
    private String telefone;
    private String email;
    private StatusFornecedor status;
}
