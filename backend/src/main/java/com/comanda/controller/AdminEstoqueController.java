package com.comanda.controller;

import com.comanda.dto.response.IngredienteResponse;
import com.comanda.service.IngredienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/estoque")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
public class AdminEstoqueController {

    private final IngredienteService ingredienteService;

    @GetMapping("/alertas")
    public ResponseEntity<List<IngredienteResponse>> listarAlertas() {
        return ResponseEntity.ok(ingredienteService.listarAbaixoDoMinimo());
    }
}
