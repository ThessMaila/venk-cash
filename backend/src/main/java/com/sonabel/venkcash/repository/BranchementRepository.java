package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.Branchement;
import com.sonabel.venkcash.entite.Branchement.StatutBranchement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BranchementRepository extends JpaRepository<Branchement, Long> {
    Optional<Branchement> findByCodeBranchement(String codeBranchement);
    List<Branchement> findByStatut(StatutBranchement statut);
    List<Branchement> findByQuartierContainingIgnoreCase(String quartier);
    List<Branchement> findByVilleContainingIgnoreCase(String ville);
    Boolean existsByCodeBranchement(String codeBranchement);
}
