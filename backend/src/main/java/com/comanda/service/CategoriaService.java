package com.comanda.service;

import com.comanda.dto.request.CategoriaRequest;
import com.comanda.dto.response.CategoriaResponse;
import com.comanda.entity.Categoria;
import com.comanda.enums.StatusCategoria;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    public List<CategoriaResponse> listarAtivas() {
        return repository.findByStatusOrderByOrdem(StatusCategoria.ATIVO)
            .stream().map(this::toResponse).toList();
    }

    public List<CategoriaResponse> listarTodas() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public CategoriaResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    public CategoriaResponse criar(CategoriaRequest req) {
        Categoria c = Categoria.builder()
            .nome(req.getNome())
            .descricao(req.getDescricao())
            .ordem(req.getOrdem())
            .status(StatusCategoria.ATIVO)
            .build();
        return toResponse(repository.save(c));
    }

    public CategoriaResponse atualizar(Long id, CategoriaRequest req) {
        Categoria c = findById(id);
        c.setNome(req.getNome());
        c.setDescricao(req.getDescricao());
        c.setOrdem(req.getOrdem());
        return toResponse(repository.save(c));
    }

    public void alterarStatus(Long id, StatusCategoria status) {
        Categoria c = findById(id);
        c.setStatus(status);
        repository.save(c);
    }

    public void deletar(Long id) {
        repository.delete(findById(id));
    }

    private Categoria findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
    }

    private CategoriaResponse toResponse(Categoria c) {
        return CategoriaResponse.builder()
            .id(c.getId()).nome(c.getNome())
            .descricao(c.getDescricao()).ordem(c.getOrdem())
            .status(c.getStatus()).build();
    }
}
