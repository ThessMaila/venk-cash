package com.sonabel.venkcash.service;

import com.sonabel.venkcash.entite.GrilleTarifaire;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.GrilleTarifaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrilleTarifaireService {

    private final GrilleTarifaireRepository grilleTarifaireRepository;

    public List<GrilleTarifaire> listerToutes() {
        return grilleTarifaireRepository.findByActifTrue();
    }

    public GrilleTarifaire trouverParId(Long id) {
        return grilleTarifaireRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Taxe non trouvee"));
    }

    public GrilleTarifaire creer(GrilleTarifaire grilleTarifaire) {
        return grilleTarifaireRepository.save(grilleTarifaire);
    }

    public GrilleTarifaire modifier(Long id, GrilleTarifaire grille) {
        GrilleTarifaire existant = trouverParId(id);
        existant.setLibelleTaxe(grille.getLibelleTaxe());
        existant.setCodeTaxe(grille.getCodeTaxe());
        existant.setType(grille.getType());
        existant.setValeur(grille.getValeur());
        existant.setActif(grille.getActif());
        existant.setDescription(grille.getDescription());
        return grilleTarifaireRepository.save(existant);
    }

    public void desactiver(Long id) {
        GrilleTarifaire taxe = trouverParId(id);
        taxe.setActif(false);
        grilleTarifaireRepository.save(taxe);
    }
}
