package com.comanda.dto.request;

import com.comanda.enums.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioRequest {
    @NotBlank
    private String nome;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String senha;
    private String telefone;
    @NotNull
    private PerfilUsuario perfil;
}
