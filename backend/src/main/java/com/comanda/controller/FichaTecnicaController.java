package com.comanda.controller;

import com.comanda.dto.request.FichaTecnicaRequest;
import com.comanda.dto.response.FichaTecnicaResponse;
import com.comanda.service.FichaTecnicaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fichas")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE','COZINHEIRO')")
public class FichaTecnicaController {

    private final FichaTecnicaService service;

    @GetMapping
    public ResponseEntity<List<FichaTecnicaResponse>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FichaTecnicaResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/prato/{pratoId}")
    public ResponseEntity<FichaTecnicaResponse> buscarPorPrato(@PathVariable Long pratoId) {
        return ResponseEntity.ok(service.buscarPorPrato(pratoId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    public ResponseEntity<FichaTecnicaResponse> salvar(@Valid @RequestBody FichaTecnicaRequest req) {
        return ResponseEntity.ok(service.salvar(req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
