package com.comanda.service;

import com.comanda.dto.request.FornecedorRequest;
import com.comanda.dto.response.FornecedorResponse;
import com.comanda.entity.Fornecedor;
import com.comanda.enums.StatusFornecedor;
import com.comanda.exception.BusinessException;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.FornecedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository repository;

    public List<FornecedorResponse> listarTodos() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public List<FornecedorResponse> listarAtivos() {
        return repository.findByStatus(StatusFornecedor.ATIVO).stream().map(this::toResponse).toList();
    }

    public FornecedorResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    public FornecedorResponse criar(FornecedorRequest req) {
        if (repository.existsByCnpj(req.getCnpj())) {
            throw new BusinessException("CNPJ já cadastrado: " + req.getCnpj());
        }
        Fornecedor f = Fornecedor.builder()
            .razaoSocial(req.getRazaoSocial()).cnpj(req.getCnpj())
            .telefone(req.getTelefone()).email(req.getEmail())
            .status(StatusFornecedor.ATIVO).build();
        return toResponse(repository.save(f));
    }

    public FornecedorResponse atualizar(Long id, FornecedorRequest req) {
        Fornecedor f = findById(id);
        f.setRazaoSocial(req.getRazaoSocial());
        f.setTelefone(req.getTelefone());
        f.setEmail(req.getEmail());
        return toResponse(repository.save(f));
    }

    public void alterarStatus(Long id, StatusFornecedor status) {
        Fornecedor f = findById(id);
        f.setStatus(status);
        repository.save(f);
    }

    public Fornecedor findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Fornecedor", id));
    }

    private FornecedorResponse toResponse(Fornecedor f) {
        return FornecedorResponse.builder()
            .id(f.getId()).razaoSocial(f.getRazaoSocial()).cnpj(f.getCnpj())
            .telefone(f.getTelefone()).email(f.getEmail()).status(f.getStatus())
            .build();
    }
}
