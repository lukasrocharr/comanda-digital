package com.comanda.controller;

import com.comanda.dto.request.MovimentacaoRequest;
import com.comanda.dto.response.MovimentacaoResponse;
import com.comanda.entity.Usuario;
import com.comanda.service.EstoqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE','COZINHEIRO')")
public class EstoqueController {

    private final EstoqueService service;

    @GetMapping
    public ResponseEntity<List<MovimentacaoResponse>> listarMovimentacoes() {
        return ResponseEntity.ok(service.listarMovimentacoes());
    }

    @GetMapping("/ingrediente/{ingredienteId}")
    public ResponseEntity<List<MovimentacaoResponse>> listarPorIngrediente(
            @PathVariable Long ingredienteId) {
        return ResponseEntity.ok(service.listarPorIngrediente(ingredienteId));
    }

    @PostMapping("/saida")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    public ResponseEntity<MovimentacaoResponse> registrarSaida(
            @Valid @RequestBody MovimentacaoRequest req,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(201).body(service.registrarSaidaManual(req, usuario));
    }
}
