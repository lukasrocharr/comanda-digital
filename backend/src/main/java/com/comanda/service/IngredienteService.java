package com.comanda.service;

import com.comanda.dto.request.IngredienteRequest;
import com.comanda.dto.response.IngredienteResponse;
import com.comanda.entity.Ingrediente;
import com.comanda.enums.StatusEstoque;
import com.comanda.exception.BusinessException;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.IngredienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredienteService {

    private final IngredienteRepository repository;

    public List<IngredienteResponse> listarTodos() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public List<IngredienteResponse> listarAbaixoDoMinimo() {
        return repository.findAbaixoDoMinimo().stream().map(this::toResponse).toList();
    }

    public IngredienteResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    public IngredienteResponse criar(IngredienteRequest req) {
        if (repository.findBySku(req.getSku()).isPresent()) {
            throw new BusinessException("SKU já cadastrado: " + req.getSku());
        }
        Ingrediente i = Ingrediente.builder()
            .nome(req.getNome()).sku(req.getSku()).unidade(req.getUnidade())
            .saldoAtual(BigDecimal.ZERO)
            .estoqueMinimo(req.getEstoqueMinimo())
            .custoUnitario(req.getCustoUnitario())
            .status(StatusEstoque.OK)
            .build();
        return toResponse(repository.save(i));
    }

    public IngredienteResponse atualizar(Long id, IngredienteRequest req) {
        Ingrediente i = findById(id);
        i.setNome(req.getNome());
        i.setUnidade(req.getUnidade());
        i.setEstoqueMinimo(req.getEstoqueMinimo());
        i.setCustoUnitario(req.getCustoUnitario());
        recalcularStatus(i);
        return toResponse(repository.save(i));
    }

    public void deletar(Long id) {
        repository.delete(findById(id));
    }

    public Ingrediente findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ingrediente", id));
    }

    public void recalcularStatus(Ingrediente i) {
        BigDecimal pct = i.getSaldoAtual().divide(i.getEstoqueMinimo(), 2, RoundingMode.HALF_UP);
        if (pct.compareTo(BigDecimal.valueOf(0.5)) <= 0) {
            i.setStatus(StatusEstoque.CRITICO);
        } else if (pct.compareTo(BigDecimal.ONE) < 0) {
            i.setStatus(StatusEstoque.BAIXO);
        } else {
            i.setStatus(StatusEstoque.OK);
        }
    }

    private IngredienteResponse toResponse(Ingrediente i) {
        double pct = 0;
        if (i.getEstoqueMinimo().compareTo(BigDecimal.ZERO) > 0) {
            pct = i.getSaldoAtual().divide(i.getEstoqueMinimo(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue();
        }
        return IngredienteResponse.builder()
            .id(i.getId()).nome(i.getNome()).sku(i.getSku()).unidade(i.getUnidade())
            .saldoAtual(i.getSaldoAtual()).estoqueMinimo(i.getEstoqueMinimo())
            .custoUnitario(i.getCustoUnitario()).status(i.getStatus())
            .percentualEstoque(pct)
            .build();
    }
}
