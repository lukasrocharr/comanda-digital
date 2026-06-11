package com.comanda.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String nome;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String senha;
    private String telefone;
    private String endereco;
}
