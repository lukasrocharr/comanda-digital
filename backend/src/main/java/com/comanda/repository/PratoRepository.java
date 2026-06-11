package com.comanda.repository;

import com.comanda.entity.Prato;
import com.comanda.enums.StatusPrato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PratoRepository extends JpaRepository<Prato, Long> {
    List<Prato> findByStatus(StatusPrato status);
    List<Prato> findByCategoria_Id(Long categoriaId);
    List<Prato> findByNomeContainingIgnoreCase(String nome);
}
