package com.comanda.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PratoCustoResponse {
    private BigDecimal custo;
}
