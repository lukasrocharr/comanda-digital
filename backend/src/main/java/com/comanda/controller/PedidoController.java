package com.comanda.controller;

import com.comanda.dto.request.PedidoRequest;
import com.comanda.dto.response.PedidoResponse;
import com.comanda.entity.Usuario;
import com.comanda.enums.StatusPedido;
import com.comanda.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','COZINHEIRO')")
    public ResponseEntity<List<PedidoResponse>> listar(
            @RequestParam(defaultValue = "false") boolean abertos) {
        return ResponseEntity.ok(abertos ? service.listarAbertos() : service.listarTodos());
    }

    @GetMapping("/meus")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<PedidoResponse>> meusPedidos(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(service.listarPorCliente(usuario.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<PedidoResponse> criar(
            @Valid @RequestBody PedidoRequest req,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(201).body(service.criar(req, usuario));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','COZINHEIRO')")
    public ResponseEntity<PedidoResponse> atualizarStatus(
            @PathVariable Long id, @RequestParam StatusPedido status) {
        return ResponseEntity.ok(service.atualizarStatus(id, status));
    }
}
