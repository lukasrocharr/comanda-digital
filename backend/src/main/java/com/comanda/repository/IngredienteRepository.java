package com.comanda.repository;

import com.comanda.entity.Ingrediente;
import com.comanda.enums.StatusEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
    Optional<Ingrediente> findBySku(String sku);
    List<Ingrediente> findByStatus(StatusEstoque status);

    @Query("SELECT i FROM Ingrediente i WHERE i.saldoAtual <= i.estoqueMinimo")
    List<Ingrediente> findAbaixoDoMinimo();
}
