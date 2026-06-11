package com.comanda.controller;

import com.comanda.dto.response.DashboardResponse;
import com.comanda.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
public class AdminDashboardController {

    private final DashboardService service;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResponse> getResumo() {
        return ResponseEntity.ok(service.getDashboard());
    }

    @GetMapping("/top-pratos")
    public ResponseEntity<List<DashboardResponse.TopPratoItem>> getTopPratos() {
        return ResponseEntity.ok(service.getTopPratos());
    }
}
