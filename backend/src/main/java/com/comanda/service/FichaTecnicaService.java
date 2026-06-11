package com.comanda.service;

import com.comanda.dto.request.FichaTecnicaItemRequest;
import com.comanda.dto.request.FichaTecnicaRequest;
import com.comanda.dto.response.FichaTecnicaResponse;
import com.comanda.entity.*;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.FichaTecnicaRepository;
import com.comanda.repository.PratoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FichaTecnicaService {

    private final FichaTecnicaRepository fichaRepository;
    private final PratoRepository pratoRepository;
    private final IngredienteService ingredienteService;

    public List<FichaTecnicaResponse> listarTodas() {
        return fichaRepository.findAll().stream().map(this::toResponse).toList();
    }

    public FichaTecnicaResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    public FichaTecnicaResponse buscarPorPrato(Long pratoId) {
        return fichaRepository.findByPrato_Id(pratoId)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Ficha técnica para o prato " + pratoId + " não encontrada"));
    }

    @Transactional
    public FichaTecnicaResponse salvar(FichaTecnicaRequest req) {
        Prato prato = pratoRepository.findById(req.getPratoId())
            .orElseThrow(() -> new ResourceNotFoundException("Prato", req.getPratoId()));

        FichaTecnica ficha = fichaRepository.findByPrato_Id(req.getPratoId())
            .orElse(FichaTecnica.builder().prato(prato).itens(new ArrayList<>()).build());

        ficha.setRendimento(req.getRendimento() != null ? req.getRendimento() : 1);
        ficha.setTempoPreparo(req.getTempoPreparo());
        ficha.setModoPreparo(req.getModoPreparo());
        ficha.getItens().clear();

        if (req.getItens() != null) {
            for (FichaTecnicaItemRequest itemReq : req.getItens()) {
                Ingrediente ing = ingredienteService.findById(itemReq.getIngredienteId());
                FichaTecnicaItem item = FichaTecnicaItem.builder()
                    .fichaTecnica(ficha).ingrediente(ing)
                    .quantidade(itemReq.getQuantidade())
                    .fatorCorrecao(itemReq.getFatorCorrecao() != null ? itemReq.getFatorCorrecao() : BigDecimal.ONE)
                    .build();
                ficha.getItens().add(item);
            }
        }

        BigDecimal custoTotal = calcularCusto(ficha);
        prato.setCusto(custoTotal);
        pratoRepository.save(prato);

        return toResponse(fichaRepository.save(ficha));
    }

    public void deletar(Long id) {
        fichaRepository.delete(findById(id));
    }

    private BigDecimal calcularCusto(FichaTecnica ficha) {
        BigDecimal bruto = ficha.getItens().stream()
            .map(item -> item.getIngrediente().getCustoUnitario()
                .multiply(item.getQuantidade())
                .multiply(item.getFatorCorrecao()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        int rendimento = ficha.getRendimento() != null && ficha.getRendimento() > 0 ? ficha.getRendimento() : 1;
        return bruto.divide(BigDecimal.valueOf(rendimento), 4, RoundingMode.HALF_UP);
    }

    public BigDecimal calcularCustoPorPratoId(Long pratoId) {
        FichaTecnica ficha = fichaRepository.findByPrato_Id(pratoId)
            .orElseThrow(() -> new ResourceNotFoundException("Ficha técnica para o prato " + pratoId + " não encontrada"));
        return calcularCusto(ficha);
    }

    private FichaTecnica findById(Long id) {
        return fichaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ficha Técnica", id));
    }

    private FichaTecnicaResponse toResponse(FichaTecnica f) {
        BigDecimal custoTotal = calcularCusto(f);
        Double foodCost = null;
        if (f.getPrato().getPreco() != null && f.getPrato().getPreco().compareTo(BigDecimal.ZERO) > 0) {
            foodCost = custoTotal.divide(f.getPrato().getPreco(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue();
        }
        List<FichaTecnicaResponse.FichaTecnicaItemResponse> itens = f.getItens().stream()
            .map(item -> {
                BigDecimal ct = item.getIngrediente().getCustoUnitario()
                    .multiply(item.getQuantidade()).multiply(item.getFatorCorrecao());
                return FichaTecnicaResponse.FichaTecnicaItemResponse.builder()
                    .id(item.getId())
                    .ingredienteId(item.getIngrediente().getId())
                    .ingredienteNome(item.getIngrediente().getNome())
                    .unidade(item.getIngrediente().getUnidade().name())
                    .quantidade(item.getQuantidade())
                    .fatorCorrecao(item.getFatorCorrecao())
                    .custoUnitario(item.getIngrediente().getCustoUnitario())
                    .custoTotal(ct)
                    .build();
            }).toList();
        return FichaTecnicaResponse.builder()
            .id(f.getId()).pratoId(f.getPrato().getId()).pratoNome(f.getPrato().getNome())
            .rendimento(f.getRendimento()).tempoPreparo(f.getTempoPreparo())
            .modoPreparo(f.getModoPreparo()).itens(itens)
            .custoTotal(custoTotal).foodCostPct(foodCost)
            .build();
    }
}
