package com.comanda.repository;

import com.comanda.entity.FornecedorProduto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FornecedorProdutoRepository extends JpaRepository<FornecedorProduto, Long> {
    List<FornecedorProduto> findByFornecedor_Id(Long fornecedorId);
    List<FornecedorProduto> findByIngrediente_IdOrderByPrecoAsc(Long ingredienteId);
}
