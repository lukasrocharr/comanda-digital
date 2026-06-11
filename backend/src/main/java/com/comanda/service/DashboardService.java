package com.comanda.service;

import com.comanda.dto.response.DashboardResponse;
import com.comanda.entity.FichaTecnica;
import com.comanda.entity.Pedido;
import com.comanda.entity.PedidoItem;
import com.comanda.enums.StatusPedido;
import com.comanda.repository.FichaTecnicaRepository;
import com.comanda.repository.IngredienteRepository;
import com.comanda.repository.PedidoItemRepository;
import com.comanda.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PedidoRepository pedidoRepository;
    private final PedidoItemRepository pedidoItemRepository;
    private final IngredienteRepository ingredienteRepository;
    private final FichaTecnicaRepository fichaRepository;

    public DashboardResponse getDashboard() {
        LocalDateTime inicioHoje = LocalDate.now().atStartOfDay();
        LocalDateTime fimHoje = inicioHoje.plusDays(1);

        BigDecimal faturamento = pedidoRepository.somarTotalPorPeriodo(inicioHoje, fimHoje);
        long totalPedidos = pedidoRepository.contarPorPeriodo(inicioHoje, fimHoje);
        BigDecimal ticketMedio = totalPedidos > 0
            ? faturamento.divide(BigDecimal.valueOf(totalPedidos), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        int abaixoMinimo = ingredienteRepository.findAbaixoDoMinimo().size();

        List<DashboardResponse.TopPratoItem> topPratos = pedidoItemRepository.findTopPratos()
            .stream().limit(5)
            .map(row -> DashboardResponse.TopPratoItem.builder()
                .nome((String) row[0])
                .vendas(((Number) row[1]).longValue())
                .build())
            .toList();

        List<DashboardResponse.FaturamentoDia> fat7Dias = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate dia = LocalDate.now().minusDays(i);
            BigDecimal total = pedidoRepository.somarTotalPorPeriodo(
                dia.atStartOfDay(), dia.plusDays(1).atStartOfDay()
            );
            fat7Dias.add(DashboardResponse.FaturamentoDia.builder()
                .dia(dia.getDayOfWeek().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR")))
                .total(total)
                .build());
        }

        double foodCostMedio = calcularFoodCostMedio(inicioHoje, fimHoje, faturamento);

        return DashboardResponse.builder()
            .faturamentoHoje(faturamento)
            .totalPedidosHoje(totalPedidos)
            .ticketMedio(ticketMedio)
            .foodCostMedio(foodCostMedio)
            .ingredientesAbaixoMinimo(abaixoMinimo)
            .topPratos(topPratos)
            .faturamento7Dias(fat7Dias)
            .build();
    }

    public List<DashboardResponse.TopPratoItem> getTopPratos() {
        return pedidoItemRepository.findTopPratos()
            .stream().limit(5)
            .map(row -> DashboardResponse.TopPratoItem.builder()
                .nome((String) row[0])
                .vendas(((Number) row[1]).longValue())
                .build())
            .toList();
    }

    private double calcularFoodCostMedio(LocalDateTime inicio, LocalDateTime fim, BigDecimal faturamento) {
        if (faturamento.compareTo(BigDecimal.ZERO) <= 0) {
            return 0.0;
        }

        List<Pedido> pedidos = pedidoRepository.findByCriadoEmBetweenAndStatusNot(inicio, fim, StatusPedido.CANCELADO);
        BigDecimal custoTotal = BigDecimal.ZERO;

        for (Pedido pedido : pedidos) {
            for (PedidoItem item : pedido.getItens()) {
                FichaTecnica ficha = fichaRepository.findByPrato_Id(item.getPrato().getId()).orElse(null);
                if (ficha == null) {
                    continue;
                }
                for (var fichaItem : ficha.getItens()) {
                    BigDecimal consumo = fichaItem.getQuantidade()
                        .multiply(fichaItem.getFatorCorrecao())
                        .multiply(BigDecimal.valueOf(item.getQuantidade()));
                    BigDecimal custoIngrediente = fichaItem.getIngrediente().getCustoUnitario()
                        .multiply(consumo);
                    custoTotal = custoTotal.add(custoIngrediente);
                }
            }
        }

        return custoTotal.divide(faturamento, 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100)).doubleValue();
    }
}
