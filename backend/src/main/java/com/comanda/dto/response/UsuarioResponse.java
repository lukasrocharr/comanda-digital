package com.comanda.dto.response;

import com.comanda.enums.PerfilUsuario;
import com.comanda.enums.StatusUsuario;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private PerfilUsuario perfil;
    private StatusUsuario status;
    private LocalDateTime criadoEm;
}
