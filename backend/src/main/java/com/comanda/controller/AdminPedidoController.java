package com.comanda.controller;

import com.comanda.dto.response.PedidoResponse;
import com.comanda.enums.StatusPedido;
import com.comanda.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pedidos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE','COZINHEIRO')")
public class AdminPedidoController {

    private final PedidoService service;

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar(
            @RequestParam(defaultValue = "false") boolean abertos) {
        return ResponseEntity.ok(abertos ? service.listarAbertos() : service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoResponse> atualizarStatus(@PathVariable Long id,
                                                         @RequestParam StatusPedido status) {
        return ResponseEntity.ok(service.atualizarStatus(id, status));
    }
}
