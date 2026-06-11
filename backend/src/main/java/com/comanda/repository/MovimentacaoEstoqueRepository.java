package com.comanda.repository;

import com.comanda.entity.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {
    List<MovimentacaoEstoque> findByIngrediente_IdOrderByCriadoEmDesc(Long ingredienteId);
    List<MovimentacaoEstoque> findAllByOrderByCriadoEmDesc();
}
