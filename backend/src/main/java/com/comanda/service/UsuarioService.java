package com.comanda.service;

import com.comanda.dto.request.UsuarioRequest;
import com.comanda.dto.response.UsuarioResponse;
import com.comanda.entity.Usuario;
import com.comanda.enums.StatusUsuario;
import com.comanda.exception.BusinessException;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioResponse> listarTodos() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    public UsuarioResponse criar(UsuarioRequest req) {
        if (repository.existsByEmail(req.getEmail())) {
            throw new BusinessException("E-mail já cadastrado: " + req.getEmail());
        }
        Usuario u = Usuario.builder()
            .nome(req.getNome()).email(req.getEmail())
            .senha(passwordEncoder.encode(req.getSenha()))
            .telefone(req.getTelefone()).perfil(req.getPerfil())
            .status(StatusUsuario.ATIVO).build();
        return toResponse(repository.save(u));
    }

    public UsuarioResponse atualizar(Long id, UsuarioRequest req) {
        Usuario u = findById(id);
        u.setNome(req.getNome());
        u.setTelefone(req.getTelefone());
        u.setPerfil(req.getPerfil());
        if (req.getSenha() != null && !req.getSenha().isBlank()) {
            u.setSenha(passwordEncoder.encode(req.getSenha()));
        }
        return toResponse(repository.save(u));
    }

    public void alterarStatus(Long id, StatusUsuario status) {
        Usuario u = findById(id);
        u.setStatus(status);
        repository.save(u);
    }

    public Usuario findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
    }

    private UsuarioResponse toResponse(Usuario u) {
        return UsuarioResponse.builder()
            .id(u.getId()).nome(u.getNome()).email(u.getEmail())
            .telefone(u.getTelefone()).perfil(u.getPerfil())
            .status(u.getStatus()).criadoEm(u.getCriadoEm())
            .build();
    }
}
