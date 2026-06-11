package com.comanda.service;

import com.comanda.dto.request.PratoRequest;
import com.comanda.dto.response.CategoriaResponse;
import com.comanda.dto.response.PratoResponse;
import com.comanda.entity.Categoria;
import com.comanda.entity.Prato;
import com.comanda.enums.StatusPrato;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.CategoriaRepository;
import com.comanda.repository.PratoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PratoService {

    private final PratoRepository pratoRepository;
    private final CategoriaRepository categoriaRepository;

    public List<PratoResponse> listarAtivos() {
        return pratoRepository.findByStatus(StatusPrato.ATIVO)
            .stream().map(this::toResponse).toList();
    }

    public List<PratoResponse> listarTodos() {
        return pratoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<PratoResponse> buscarPorNome(String nome) {
        return pratoRepository.findByNomeContainingIgnoreCase(nome)
            .stream().map(this::toResponse).toList();
    }

    public List<PratoResponse> listarPorCategoria(Long categoriaId) {
        return pratoRepository.findByCategoria_Id(categoriaId)
            .stream().map(this::toResponse).toList();
    }

    public PratoResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    public PratoResponse criar(PratoRequest req) {
        Prato p = buildFromRequest(new Prato(), req);
        return toResponse(pratoRepository.save(p));
    }

    public PratoResponse atualizar(Long id, PratoRequest req) {
        Prato p = buildFromRequest(findById(id), req);
        return toResponse(pratoRepository.save(p));
    }

    public void deletar(Long id) {
        pratoRepository.delete(findById(id));
    }

    private Prato buildFromRequest(Prato p, PratoRequest req) {
        p.setNome(req.getNome());
        p.setDescricao(req.getDescricao());
        p.setEmoji(req.getEmoji());
        p.setPreco(req.getPreco());
        p.setTempoPreparo(req.getTempoPreparo());
        p.setStatus(req.getStatus() != null ? req.getStatus() : StatusPrato.ATIVO);
        if (req.getCategoriaId() != null) {
            Categoria cat = categoriaRepository.findById(req.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", req.getCategoriaId()));
            p.setCategoria(cat);
        }
        return p;
    }

    private Prato findById(Long id) {
        return pratoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Prato", id));
    }

    PratoResponse toResponse(Prato p) {
        Double foodCost = null;
        if (p.getCusto() != null && p.getPreco() != null && p.getPreco().compareTo(BigDecimal.ZERO) > 0) {
            foodCost = p.getCusto().divide(p.getPreco(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue();
        }
        CategoriaResponse cat = p.getCategoria() != null
            ? CategoriaResponse.builder()
                .id(p.getCategoria().getId()).nome(p.getCategoria().getNome())
                .ordem(p.getCategoria().getOrdem()).status(p.getCategoria().getStatus()).build()
            : null;
        return PratoResponse.builder()
            .id(p.getId()).nome(p.getNome()).descricao(p.getDescricao()).emoji(p.getEmoji())
            .categoria(cat).preco(p.getPreco()).custo(p.getCusto())
            .tempoPreparo(p.getTempoPreparo()).status(p.getStatus())
            .foodCostPct(foodCost)
            .build();
    }
}
