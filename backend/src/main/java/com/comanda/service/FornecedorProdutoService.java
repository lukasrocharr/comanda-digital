package com.comanda.service;

import com.comanda.dto.request.FornecedorProdutoRequest;
import com.comanda.dto.response.FornecedorProdutoResponse;
import com.comanda.entity.Fornecedor;
import com.comanda.entity.FornecedorProduto;
import com.comanda.entity.Ingrediente;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.FornecedorProdutoRepository;
import com.comanda.repository.FornecedorRepository;
import com.comanda.repository.IngredienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FornecedorProdutoService {

    private final FornecedorRepository fornecedorRepository;
    private final IngredienteRepository ingredienteRepository;
    private final FornecedorProdutoRepository repository;

    public FornecedorProdutoResponse criar(Long fornecedorId, FornecedorProdutoRequest req) {
        Fornecedor fornecedor = fornecedorRepository.findById(fornecedorId)
            .orElseThrow(() -> new ResourceNotFoundException("Fornecedor", fornecedorId));
        Ingrediente ingrediente = ingredienteRepository.findById(req.getIngredienteId())
            .orElseThrow(() -> new ResourceNotFoundException("Ingrediente", req.getIngredienteId()));

        FornecedorProduto produto = FornecedorProduto.builder()
            .fornecedor(fornecedor)
            .ingrediente(ingrediente)
            .preco(req.getPreco())
            .build();

        return toResponse(repository.save(produto));
    }

    public List<FornecedorProdutoResponse> listarPorFornecedor(Long fornecedorId) {
        fornecedorRepository.findById(fornecedorId)
            .orElseThrow(() -> new ResourceNotFoundException("Fornecedor", fornecedorId));
        return repository.findByFornecedor_Id(fornecedorId).stream().map(this::toResponse).toList();
    }

    public List<FornecedorProdutoResponse> cotacaoPorIngrediente(Long ingredienteId) {
        ingredienteRepository.findById(ingredienteId)
            .orElseThrow(() -> new ResourceNotFoundException("Ingrediente", ingredienteId));
        return repository.findByIngrediente_IdOrderByPrecoAsc(ingredienteId).stream()
            .map(this::toResponse).toList();
    }

    private FornecedorProdutoResponse toResponse(FornecedorProduto produto) {
        return FornecedorProdutoResponse.builder()
            .id(produto.getId())
            .fornecedorId(produto.getFornecedor().getId())
            .fornecedorNome(produto.getFornecedor().getRazaoSocial())
            .ingredienteId(produto.getIngrediente().getId())
            .ingredienteNome(produto.getIngrediente().getNome())
            .preco(produto.getPreco())
            .build();
    }
}
