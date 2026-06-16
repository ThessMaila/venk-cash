package com.sonabel.venkcash.service;

import com.sonabel.venkcash.entite.Compteur;
import com.sonabel.venkcash.entite.Compteur.StatutCompteur;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.CompteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompteurService {

    private final CompteurRepository compteurRepository;

    public Compteur creer(Compteur compteur) {
        if (compteurRepository.existsByNumeroCompteur(compteur.getNumeroCompteur())) {
            throw new ExceptionMetier("Ce numero de compteur existe deja");
        }
        compteur.setStatut(StatutCompteur.EN_STOCK);
        return compteurRepository.save(compteur);
    }

    public Compteur trouverParId(Long id) {
        return compteurRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Compteur non trouve"));
    }

    public Compteur trouverParNumero(String numeroCompteur) {
        return compteurRepository.findByNumeroCompteur(numeroCompteur)
                .orElseThrow(() -> new ExceptionMetier("Compteur non trouve"));
    }

    public List<Compteur> listerTous() {
        return compteurRepository.findAll();
    }

    public List<Compteur> listerParStatut(StatutCompteur statut) {
        return compteurRepository.findByStatut(statut);
    }

    public Compteur changerStatut(Long id, StatutCompteur nouveauStatut) {
        Compteur compteur = trouverParId(id);
        compteur.setStatut(nouveauStatut);
        return compteurRepository.save(compteur);
    }

    public Compteur changerStatutParNumero(String numeroCompteur, StatutCompteur nouveauStatut) {
        Compteur compteur = trouverParNumero(numeroCompteur);
        compteur.setStatut(nouveauStatut);
        return compteurRepository.save(compteur);
    }
}
