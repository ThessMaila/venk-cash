package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.Tarif;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TarifRepository extends JpaRepository<Tarif, Long> {
    Optional<Tarif> findByPuissanceAmperes(Integer puissanceAmperes);
    List<Tarif> findByActifTrue();
}
