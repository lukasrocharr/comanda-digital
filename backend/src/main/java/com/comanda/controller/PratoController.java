package com.comanda.controller;

import com.comanda.dto.request.PratoRequest;
import com.comanda.dto.response.PratoResponse;
import com.comanda.service.PratoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pratos")
@RequiredArgsConstructor
public class PratoController {

    private final PratoService service;

    @GetMapping
    public ResponseEntity<List<PratoResponse>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(defaultValue = "false") boolean todos) {
        if (nome != null) return ResponseEntity.ok(service.buscarPorNome(nome));
        if (categoriaId != null) return ResponseEntity.ok(service.listarPorCategoria(categoriaId));
        return ResponseEntity.ok(todos ? service.listarTodos() : service.listarAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PratoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    public ResponseEntity<PratoResponse> criar(@Valid @RequestBody PratoRequest req) {
        return ResponseEntity.status(201).body(service.criar(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    public ResponseEntity<PratoResponse> atualizar(
            @PathVariable Long id, @Valid @RequestBody PratoRequest req) {
        return ResponseEntity.ok(service.atualizar(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
