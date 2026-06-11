package com.comanda.dto.response;

import com.comanda.enums.StatusPedidoCompra;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class PedidoCompraResponse {
    private Long id;
    private Long fornecedorId;
    private String fornecedorNome;
    private StatusPedidoCompra status;
    private BigDecimal total;
    private LocalDateTime criadoEm;
    private List<PedidoCompraItemResponse> itens;

    @Data @Builder
    public static class PedidoCompraItemResponse {
        private Long id;
        private Long ingredienteId;
        private String ingredienteNome;
        private String unidade;
        private BigDecimal quantidade;
        private BigDecimal precoUnitario;
        private BigDecimal subtotal;
    }
}
