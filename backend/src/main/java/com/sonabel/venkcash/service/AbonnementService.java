package com.sonabel.venkcash.service;

import com.sonabel.venkcash.dto.*;
import com.sonabel.venkcash.entite.*;
import com.sonabel.venkcash.entite.Compteur.StatutCompteur;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AbonnementService {

    private final AbonnementRepository abonnementRepository;
    private final AbonneRepository abonneRepository;
    private final BranchementRepository branchementRepository;
    private final CompteurRepository compteurRepository;
    private final TarifRepository tarifRepository;

    @Transactional
    public Abonnement souscrire(SouscriptionRequete requete) {
        Branchement branchement = branchementRepository.findByCodeBranchement(requete.getCodeBranchement())
                .orElseThrow(() -> new ExceptionMetier("Branchement non trouve"));

        if (branchement.getStatut() != Branchement.StatutBranchement.ACTIF) {
            throw new ExceptionMetier("Ce branchement n'est pas actif");
        }

        Compteur compteur = compteurRepository.findByNumeroCompteur(requete.getNumeroCompteur())
                .orElseThrow(() -> new ExceptionMetier("Compteur non trouve"));

        if (compteur.getStatut() != StatutCompteur.EN_STOCK) {
            throw new ExceptionMetier("Ce compteur n'est pas disponible (statut: " + compteur.getStatut() + ")");
        }

        Tarif tarif = tarifRepository.findByPuissanceAmperes(requete.getPuissanceAmperes())
                .orElseThrow(() -> new ExceptionMetier("Tarif non trouve pour la puissance " + requete.getPuissanceAmperes() + "A"));

        Abonne abonne = Abonne.builder()
                .nom(requete.getNom())
                .prenom(requete.getPrenom())
                .email(requete.getEmail())
                .telephone(requete.getTelephone())
                .adresse(requete.getAdresse())
                .actif(true)
                .build();
        abonne = abonneRepository.save(abonne);

        compteur.setStatut(StatutCompteur.ACTIF);
        compteurRepository.save(compteur);

        Abonnement abonnement = Abonnement.builder()
                .numeroAbonnement(genererNumeroAbonnement())
                .abonne(abonne)
                .branchement(branchement)
                .compteur(compteur)
                .tarif(tarif)
                .statut(Abonnement.StatutAbonnement.ACTIF)
                .actif(true)
                .build();

        return abonnementRepository.save(abonnement);
    }

    @Transactional
    public Abonnement changerPuissance(ChangementPuissanceRequete requete) {
        Abonnement abonnementActuel = abonnementRepository.findById(requete.getAbonnementId())
                .orElseThrow(() -> new ExceptionMetier("Abonnement non trouve"));

        if (abonnementActuel.getStatut() != Abonnement.StatutAbonnement.ACTIF) {
            throw new ExceptionMetier("L'abonnement actuel n'est pas actif");
        }

        Tarif nouveauTarif = tarifRepository.findByPuissanceAmperes(requete.getNouvellePuissance())
                .orElseThrow(() -> new ExceptionMetier("Tarif non trouve pour la puissance " + requete.getNouvellePuissance() + "A"));

        abonnementActuel.setStatut(Abonnement.StatutAbonnement.RESILIE);
        abonnementActuel.setActif(false);
        abonnementActuel.setDateResiliation(LocalDateTime.now());
        abonnementRepository.save(abonnementActuel);

        Abonnement nouvelAbonnement = Abonnement.builder()
                .numeroAbonnement(genererNumeroAbonnement())
                .abonne(abonnementActuel.getAbonne())
                .branchement(abonnementActuel.getBranchement())
                .compteur(abonnementActuel.getCompteur())
                .tarif(nouveauTarif)
                .statut(Abonnement.StatutAbonnement.ACTIF)
                .actif(true)
                .build();

        return abonnementRepository.save(nouvelAbonnement);
    }

    @Transactional
    public Abonnement muterAbonne(MutationRequete requete) {
        Abonnement abonnementActuel = abonnementRepository.findById(requete.getAbonnementActuelId())
                .orElseThrow(() -> new ExceptionMetier("Abonnement non trouve"));

        abonnementActuel.setStatut(Abonnement.StatutAbonnement.RESILIE);
        abonnementActuel.setActif(false);
        abonnementActuel.setDateResiliation(LocalDateTime.now());
        abonnementRepository.save(abonnementActuel);

        Abonne nouvelAbonne = Abonne.builder()
                .nom(requete.getNouveauNom())
                .prenom(requete.getNouveauPrenom())
                .email(requete.getNouvelEmail())
                .telephone(requete.getNouveauTelephone())
                .adresse(requete.getNouvelleAdresse())
                .actif(true)
                .build();
        nouvelAbonne = abonneRepository.save(nouvelAbonne);

        Abonnement nouvelAbonnement = Abonnement.builder()
                .numeroAbonnement(genererNumeroAbonnement())
                .abonne(nouvelAbonne)
                .branchement(abonnementActuel.getBranchement())
                .compteur(abonnementActuel.getCompteur())
                .tarif(abonnementActuel.getTarif())
                .statut(Abonnement.StatutAbonnement.ACTIF)
                .actif(true)
                .build();

        return abonnementRepository.save(nouvelAbonnement);
    }

    public Abonnement trouverParId(Long id) {
        return abonnementRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Abonnement non trouve"));
    }

    public Abonnement trouverParNumeroCompteur(String numeroCompteur) {
        return abonnementRepository.findByCompteurNumeroCompteurAndActifTrue(numeroCompteur)
                .orElseThrow(() -> new ExceptionMetier("Aucun abonnement actif trouve pour ce compteur"));
    }

    public List<Abonnement> listerTous() {
        return abonnementRepository.findAll();
    }

    public List<Abonnement> listerActifs() {
        return abonnementRepository.findByActifTrue();
    }

    private String genererNumeroAbonnement() {
        return "ABN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
