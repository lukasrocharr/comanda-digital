package com.comanda.controller;

import com.comanda.dto.request.IngredienteRequest;
import com.comanda.dto.response.IngredienteResponse;
import com.comanda.service.IngredienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ingredientes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
public class AdminIngredienteController {

    private final IngredienteService service;

    @GetMapping
    public ResponseEntity<List<IngredienteResponse>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping
    public ResponseEntity<IngredienteResponse> criar(@Valid @RequestBody IngredienteRequest req) {
        return ResponseEntity.status(201).body(service.criar(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredienteResponse> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody IngredienteRequest req) {
        return ResponseEntity.ok(service.atualizar(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
