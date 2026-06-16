package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.GrilleTarifaire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GrilleTarifaireRepository extends JpaRepository<GrilleTarifaire, Long> {
    List<GrilleTarifaire> findByActifTrue();
    List<GrilleTarifaire> findByType(GrilleTarifaire.TypeTaxe type);
}
