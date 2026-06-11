package com.comanda.controller;

import com.comanda.dto.request.FornecedorRequest;
import com.comanda.dto.response.FornecedorResponse;
import com.comanda.enums.StatusFornecedor;
import com.comanda.service.FornecedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
public class FornecedorController {

    private final FornecedorService service;

    @GetMapping
    public ResponseEntity<List<FornecedorResponse>> listar(
            @RequestParam(defaultValue = "false") boolean apenasAtivos) {
        return ResponseEntity.ok(apenasAtivos ? service.listarAtivos() : service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FornecedorResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<FornecedorResponse> criar(@Valid @RequestBody FornecedorRequest req) {
        return ResponseEntity.status(201).body(service.criar(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedorResponse> atualizar(
            @PathVariable Long id, @Valid @RequestBody FornecedorRequest req) {
        return ResponseEntity.ok(service.atualizar(id, req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(
            @PathVariable Long id, @RequestParam StatusFornecedor status) {
        service.alterarStatus(id, status);
        return ResponseEntity.noContent().build();
    }
}
