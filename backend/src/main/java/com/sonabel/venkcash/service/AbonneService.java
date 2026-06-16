package com.sonabel.venkcash.service;

import com.sonabel.venkcash.entite.Abonne;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.AbonneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AbonneService {

    private final AbonneRepository abonneRepository;

    public Abonne creer(Abonne abonne) {
        return abonneRepository.save(abonne);
    }

    public Abonne modifier(Long id, Abonne details) {
        Abonne abonne = trouverParId(id);
        abonne.setNom(details.getNom());
        abonne.setPrenom(details.getPrenom());
        abonne.setEmail(details.getEmail());
        abonne.setTelephone(details.getTelephone());
        abonne.setAdresse(details.getAdresse());
        return abonneRepository.save(abonne);
    }

    public Abonne trouverParId(Long id) {
        return abonneRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Abonne non trouve"));
    }

    public List<Abonne> listerTous() {
        return abonneRepository.findAll();
    }

    public List<Abonne> rechercherParNom(String nom) {
        return abonneRepository.findByNomContainingIgnoreCase(nom);
    }

    public void desactiver(Long id) {
        Abonne abonne = trouverParId(id);
        abonne.setActif(false);
        abonneRepository.save(abonne);
    }
}
