package com.comanda.controller;

import com.comanda.dto.request.PratoRequest;
import com.comanda.dto.response.PratoResponse;
import com.comanda.service.PratoService;
import com.comanda.service.FichaTecnicaService;
import com.comanda.dto.response.PratoCustoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/pratos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
public class AdminPratoController {

    private final PratoService service;
    private final FichaTecnicaService fichaService;

    @GetMapping
    public ResponseEntity<List<PratoResponse>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping
    public ResponseEntity<PratoResponse> criar(@Valid @RequestBody PratoRequest req) {
        return ResponseEntity.status(201).body(service.criar(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PratoResponse> atualizar(@PathVariable Long id,
                                                   @Valid @RequestBody PratoRequest req) {
        return ResponseEntity.ok(service.atualizar(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/custo")
    public ResponseEntity<PratoCustoResponse> custo(@PathVariable Long id) {
        BigDecimal custo = fichaService.calcularCustoPorPratoId(id);
        return ResponseEntity.ok(new PratoCustoResponse(custo));
    }
}
