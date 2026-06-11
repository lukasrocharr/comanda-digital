package com.comanda.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class DashboardResponse {
    private BigDecimal faturamentoHoje;
    private long totalPedidosHoje;
    private BigDecimal ticketMedio;
    private Double foodCostMedio;
    private int ingredientesAbaixoMinimo;
    private List<TopPratoItem> topPratos;
    private List<FaturamentoDia> faturamento7Dias;

    @Data @Builder
    public static class TopPratoItem {
        private String nome;
        private long vendas;
    }

    @Data @Builder
    public static class FaturamentoDia {
        private String dia;
        private BigDecimal total;
    }
}
