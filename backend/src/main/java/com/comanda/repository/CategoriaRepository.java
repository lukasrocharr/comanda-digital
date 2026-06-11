package com.comanda.repository;

import com.comanda.entity.Categoria;
import com.comanda.enums.StatusCategoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByStatusOrderByOrdem(StatusCategoria status);
}
