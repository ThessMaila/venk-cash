package com.sonabel.venkcash.service;

import com.sonabel.venkcash.entite.Tarif;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.TarifRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarifService {

    private final TarifRepository tarifRepository;

    public List<Tarif> listerTous() {
        return tarifRepository.findByActifTrue();
    }

    public Tarif trouverParId(Long id) {
        return tarifRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Tarif non trouve"));
    }

    public Tarif creer(Tarif tarif) {
        return tarifRepository.save(tarif);
    }

    public Tarif modifier(Long id, Tarif tarif) {
        Tarif existant = trouverParId(id);
        existant.setLibelle(tarif.getLibelle());
        existant.setPuissanceAmperes(tarif.getPuissanceAmperes());
        existant.setCoutUnitaireKwh(tarif.getCoutUnitaireKwh());
        existant.setActif(tarif.getActif());
        return tarifRepository.save(existant);
    }

    public void desactiver(Long id) {
        Tarif tarif = trouverParId(id);
        tarif.setActif(false);
        tarifRepository.save(tarif);
    }
}
