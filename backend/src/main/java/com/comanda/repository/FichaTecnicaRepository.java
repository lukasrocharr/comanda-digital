package com.comanda.repository;

import com.comanda.entity.FichaTecnica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FichaTecnicaRepository extends JpaRepository<FichaTecnica, Long> {
    Optional<FichaTecnica> findByPrato_Id(Long pratoId);
}
