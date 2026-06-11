package com.comanda.repository;

import com.comanda.entity.FichaTecnicaItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FichaTecnicaItemRepository extends JpaRepository<FichaTecnicaItem, Long> {
    List<FichaTecnicaItem> findByFichaTecnica_Id(Long fichaId);
    void deleteByFichaTecnica_Id(Long fichaId);
}
