package com.comanda.controller;

import com.comanda.dto.request.FornecedorProdutoRequest;
import com.comanda.dto.request.FornecedorProdutoRequest;
import com.comanda.dto.request.FornecedorRequest;
import com.comanda.dto.response.FornecedorProdutoResponse;
import com.comanda.dto.response.FornecedorResponse;
import com.comanda.enums.StatusFornecedor;
import com.comanda.service.FornecedorProdutoService;
import com.comanda.service.FornecedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fornecedores")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFornecedorController {

    private final FornecedorService fornecedorService;
    private final FornecedorProdutoService produtoService;

    @GetMapping
    public ResponseEntity<List<FornecedorResponse>> listar(
            @RequestParam(defaultValue = "false") boolean apenasAtivos) {
        return ResponseEntity.ok(apenasAtivos ? fornecedorService.listarAtivos() : fornecedorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FornecedorResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(fornecedorService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<FornecedorResponse> criar(@Valid @RequestBody FornecedorRequest req) {
        return ResponseEntity.status(201).body(fornecedorService.criar(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedorResponse> atualizar(@PathVariable Long id,
                                                        @Valid @RequestBody FornecedorRequest req) {
        return ResponseEntity.ok(fornecedorService.atualizar(id, req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(@PathVariable Long id,
                                              @RequestParam StatusFornecedor status) {
        fornecedorService.alterarStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/produtos")
    public ResponseEntity<List<FornecedorProdutoResponse>> listarProdutos(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.listarPorFornecedor(id));
    }

    @PostMapping("/{id}/produtos")
    public ResponseEntity<FornecedorProdutoResponse> adicionarProduto(
            @PathVariable Long id,
            @Valid @RequestBody FornecedorProdutoRequest req) {
        return ResponseEntity.status(201).body(produtoService.criar(id, req));
    }
}
