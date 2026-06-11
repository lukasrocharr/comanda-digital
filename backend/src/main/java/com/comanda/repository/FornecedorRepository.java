package com.comanda.repository;

import com.comanda.entity.Fornecedor;
import com.comanda.enums.StatusFornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {
    List<Fornecedor> findByStatus(StatusFornecedor status);
    boolean existsByCnpj(String cnpj);
}
