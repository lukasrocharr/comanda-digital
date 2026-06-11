package com.comanda.controller;

import com.comanda.dto.request.PedidoCompraRequest;
import com.comanda.dto.response.PedidoCompraResponse;
import com.comanda.entity.Usuario;
import com.comanda.service.PedidoCompraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
public class PedidoCompraController {

    private final PedidoCompraService service;

    @GetMapping
    public ResponseEntity<List<PedidoCompraResponse>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoCompraResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PedidoCompraResponse> criar(@Valid @RequestBody PedidoCompraRequest req) {
        return ResponseEntity.status(201).body(service.criar(req));
    }

    @PatchMapping("/{id}/enviar")
    public ResponseEntity<PedidoCompraResponse> enviar(@PathVariable Long id) {
        return ResponseEntity.ok(service.enviar(id));
    }

    @PatchMapping("/{id}/receber")
    public ResponseEntity<PedidoCompraResponse> receber(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(service.receber(id, usuario));
    }
}
