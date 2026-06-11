package com.comanda.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.comanda.dto.request.LoginRequest;
import com.comanda.dto.request.RegisterRequest;
import com.comanda.dto.response.AuthResponse;
import com.comanda.dto.response.UsuarioResponse;
import com.comanda.entity.Usuario;
import com.comanda.enums.PerfilUsuario;
import com.comanda.enums.StatusUsuario;
import com.comanda.exception.BusinessException;
import com.comanda.repository.UsuarioRepository;
import com.comanda.security.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthResponse login(LoginRequest req) {
        log.info("AuthService.login attempt for email={}", req.getEmail());
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getSenha())
            );
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            Usuario usuario = (Usuario) userDetails;
            return AuthResponse.builder()
                .token(token)
                .usuario(toResponse(usuario))
                .build();
        } catch (org.springframework.security.core.AuthenticationException ex) {
            log.warn("Authentication failed for {}: {}", req.getEmail(), ex.getMessage());
            throw ex;
        }
    }

    public AuthResponse register(RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new BusinessException("E-mail já cadastrado: " + req.getEmail());
        }
        Usuario usuario = Usuario.builder()
            .nome(req.getNome())
            .email(req.getEmail())
            .senha(passwordEncoder.encode(req.getSenha()))
            .telefone(req.getTelefone())
            .endereco(req.getEndereco())
            .perfil(PerfilUsuario.CLIENTE)
            .status(StatusUsuario.ATIVO)
            .build();
        usuario = usuarioRepository.save(usuario);
        String token = jwtService.generateToken(usuario);
        return AuthResponse.builder()
            .token(token)
            .usuario(toResponse(usuario))
            .build();
    }

    private UsuarioResponse toResponse(Usuario u) {
        return UsuarioResponse.builder()
            .id(u.getId()).nome(u.getNome()).email(u.getEmail())
            .telefone(u.getTelefone()).perfil(u.getPerfil())
            .status(u.getStatus()).criadoEm(u.getCriadoEm())
            .build();
    }
}
