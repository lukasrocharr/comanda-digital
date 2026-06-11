package com.comanda.dto.response;

import com.comanda.enums.StatusPedido;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class PedidoResponse {
    private Long id;
    private String clienteNome;
    private Long clienteId;
    private StatusPedido status;
    private BigDecimal total;
    private String endereco;
    private LocalDateTime criadoEm;
    private List<PedidoItemResponse> itens;

    @Data @Builder
    public static class PedidoItemResponse {
        private Long id;
        private Long pratoId;
        private String pratoNome;
        private String pratoEmoji;
        private Integer quantidade;
        private String obs;
        private BigDecimal precoUnitario;
        private BigDecimal subtotal;
    }
}
