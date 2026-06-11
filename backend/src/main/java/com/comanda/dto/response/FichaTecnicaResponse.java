package com.comanda.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class FichaTecnicaResponse {
    private Long id;
    private Long pratoId;
    private String pratoNome;
    private Integer rendimento;
    private Integer tempoPreparo;
    private String modoPreparo;
    private List<FichaTecnicaItemResponse> itens;
    private BigDecimal custoTotal;
    private Double foodCostPct;

    @Data @Builder
    public static class FichaTecnicaItemResponse {
        private Long id;
        private Long ingredienteId;
        private String ingredienteNome;
        private String unidade;
        private BigDecimal quantidade;
        private BigDecimal fatorCorrecao;
        private BigDecimal custoUnitario;
        private BigDecimal custoTotal;
    }
}
