package com.comanda.controller;

import com.comanda.dto.response.FornecedorProdutoResponse;
import com.comanda.service.FornecedorProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cotacao")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCotacaoController {

    private final FornecedorProdutoService produtoService;

    @GetMapping("/{ingredienteId}")
    public ResponseEntity<List<FornecedorProdutoResponse>> listarCotacao(
            @PathVariable Long ingredienteId) {
        return ResponseEntity.ok(produtoService.cotacaoPorIngrediente(ingredienteId));
    }
}
