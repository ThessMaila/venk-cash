package com.sonabel.venkcash.service;

import com.sonabel.venkcash.entite.Branchement;
import com.sonabel.venkcash.entite.Branchement.StatutBranchement;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.BranchementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchementService {

    private final BranchementRepository branchementRepository;

    public Branchement creer(Branchement branchement) {
        if (branchementRepository.existsByCodeBranchement(branchement.getCodeBranchement())) {
            throw new ExceptionMetier("Ce code de branchement existe deja");
        }
        branchement.setStatut(StatutBranchement.ACTIF);
        return branchementRepository.save(branchement);
    }

    public Branchement trouverParId(Long id) {
        return branchementRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Branchement non trouve"));
    }

    public Branchement trouverParCode(String codeBranchement) {
        return branchementRepository.findByCodeBranchement(codeBranchement)
                .orElseThrow(() -> new ExceptionMetier("Branchement non trouve"));
    }

    public List<Branchement> listerTous() {
        return branchementRepository.findAll();
    }

    public List<Branchement> listerParStatut(StatutBranchement statut) {
        return branchementRepository.findByStatut(statut);
    }
}
