package com.sonabel.venkcash.service;

import com.sonabel.venkcash.dto.*;
import com.sonabel.venkcash.entite.*;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionAchatRepository transactionRepository;
    private final AbonnementRepository abonnementRepository;
    private final DetailTaxeRepository detailTaxeRepository;
    private final RecuRepository recuRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final MoteurCalculKwh moteurCalculKwh;
    private final TokenService tokenService;
    private final RecuService recuService;

    public PreCalculDTO preCalculer(AchatRequete requete) {
        Abonnement abonnement = abonnementRepository
                .findByCompteurNumeroCompteurAndActifTrue(requete.getNumeroCompteur())
                .orElseThrow(() -> new ExceptionMetier("Aucun abonnement actif trouve pour ce compteur"));

        return moteurCalculKwh.calculer(requete.getMontantVerse(), abonnement.getTarif());
    }

    @Transactional
    public RecuVenteDTO effectuerAchat(AchatRequete requete, String nomUtilisateur) {
        Abonnement abonnement = abonnementRepository
                .findByCompteurNumeroCompteurAndActifTrue(requete.getNumeroCompteur())
                .orElseThrow(() -> new ExceptionMetier("Aucun abonnement actif trouve pour ce compteur"));

        if (abonnement.getStatut() != Abonnement.StatutAbonnement.ACTIF) {
            throw new ExceptionMetier("Cet abonnement n'est pas actif");
        }

        Tarif tarif = abonnement.getTarif();
        PreCalculDTO preCalcul = moteurCalculKwh.calculer(requete.getMontantVerse(), tarif);

        if (!preCalcul.getMontantSuffisant()) {
            throw new ExceptionMetier(preCalcul.getMessage());
        }

        if (requete.getMontantRecu().compareTo(requete.getMontantVerse()) < 0) {
            throw new ExceptionMetier("Le montant recu est inferieur au montant verse");
        }

        BigDecimal monnaieRendue = requete.getMontantRecu().subtract(requete.getMontantVerse());

        String tokenRecharge = tokenService.genererTokenRecharge();
        String codeTransaction = tokenService.genererCodeTransaction();

        Utilisateur utilisateur = utilisateurRepository.findByNomUtilisateur(nomUtilisateur)
                .orElse(null);

        TransactionAchat transaction = TransactionAchat.builder()
                .codeTransaction(codeTransaction)
                .abonnement(abonnement)
                .utilisateur(utilisateur)
                .montantVerse(requete.getMontantVerse())
                .montantTaxes(preCalcul.getMontantTaxes())
                .montantNet(preCalcul.getMontantNet())
                .coutUnitaireKwh(tarif.getCoutUnitaireKwh())
                .quantiteKwh(preCalcul.getQuantiteKwh())
                .montantRecu(requete.getMontantRecu())
                .monnaieRendue(monnaieRendue)
                .tokenRecharge(tokenRecharge)
                .statut(TransactionAchat.StatutTransaction.VALIDEE)
                .build();

        transaction = transactionRepository.save(transaction);

        for (DetailTaxeDTO taxeDTO : preCalcul.getDetailsTaxes()) {
            DetailTaxe detailTaxe = DetailTaxe.builder()
                    .transaction(transaction)
                    .libelleTaxe(taxeDTO.getLibelle())
                    .codeTaxe(taxeDTO.getCode())
                    .montant(taxeDTO.getMontant())
                    .build();
            detailTaxeRepository.save(detailTaxe);
        }

        String numeroRecu = tokenService.genererNumeroRecu();

        Recu recu = Recu.builder()
                .numeroRecu(numeroRecu)
                .transaction(transaction)
                .modeEnvoi(Recu.ModeEnvoi.IMPRESSION)
                .imprime(false)
                .envoye(false)
                .build();

        if (requete.getEnvoyerEmail() != null && requete.getEnvoyerEmail()
                && abonnement.getAbonne().getEmail() != null) {
            recu.setModeEnvoi(Recu.ModeEnvoi.EMAIL);
            recu.setDestinataire(abonnement.getAbonne().getEmail());
            recuService.envoyerParEmail(recu);
            recu.setEnvoye(true);
        }

        recuRepository.save(recu);

        return construireRecuVenteDTO(transaction, recu, abonnement);
    }

    @Transactional
    public RecuVenteDTO annulerAchat(Long transactionId) {
        TransactionAchat transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ExceptionMetier("Transaction non trouvee"));

        if (transaction.getStatut() != TransactionAchat.StatutTransaction.VALIDEE) {
            throw new ExceptionMetier("Cette transaction ne peut pas etre annulee");
        }

        transaction.setStatut(TransactionAchat.StatutTransaction.ANNULEE);
        transaction.setTokenRecharge(tokenService.genererTokenAnnulation());
        transactionRepository.save(transaction);

        return construireRecuVenteDTO(
                transaction,
                recuRepository.findByTransactionId(transactionId).orElse(null),
                transaction.getAbonnement()
        );
    }

    public TransactionAchat trouverParId(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Transaction non trouvee"));
    }

    public List<TransactionRecenteDTO> listerTransactionsRecentes() {
        return transactionRepository.findTop20ByOrderByDateTransactionDesc()
                .stream()
                .map(t -> TransactionRecenteDTO.builder()
                        .codeTransaction(t.getCodeTransaction())
                        .nomAbonne(t.getAbonnement().getAbonne().getNom())
                        .prenomAbonne(t.getAbonnement().getAbonne().getPrenom())
                        .numeroCompteur(t.getAbonnement().getCompteur().getNumeroCompteur())
                        .montantVerse(t.getMontantVerse())
                        .quantiteKwh(t.getQuantiteKwh())
                        .dateTransaction(t.getDateTransaction())
                        .statut(t.getStatut().name())
                        .caissiere(t.getUtilisateur() != null ? t.getUtilisateur().getNomUtilisateur() : "Systeme")
                        .build())
                .collect(Collectors.toList());
    }

    public List<TransactionAchat> listerParAbonnement(Long abonnementId) {
        return transactionRepository.findByAbonnementIdOrderByDateTransactionDesc(abonnementId);
    }

    private RecuVenteDTO construireRecuVenteDTO(TransactionAchat transaction, Recu recu, Abonnement abonnement) {
        List<DetailTaxeDTO> detailsTaxes = detailTaxeRepository.findByTransactionId(transaction.getId())
                .stream()
                .map(dt -> DetailTaxeDTO.builder()
                        .libelle(dt.getLibelleTaxe())
                        .code(dt.getCodeTaxe())
                        .montant(dt.getMontant())
                        .build())
                .collect(Collectors.toList());

        return RecuVenteDTO.builder()
                .id(transaction.getId())
                .numeroRecu(recu != null ? recu.getNumeroRecu() : null)
                .numeroAbonnement(abonnement.getNumeroAbonnement())
                .nomAbonne(abonnement.getAbonne().getNom())
                .prenomAbonne(abonnement.getAbonne().getPrenom())
                .numeroCompteur(abonnement.getCompteur().getNumeroCompteur())
                .puissanceSouscrite(abonnement.getTarif().getPuissanceAmperes() + "A")
                .montantVerse(transaction.getMontantVerse())
                .montantTaxes(transaction.getMontantTaxes())
                .montantNet(transaction.getMontantNet())
                .coutUnitaireKwh(transaction.getCoutUnitaireKwh())
                .quantiteKwh(transaction.getQuantiteKwh())
                .montantRecu(transaction.getMontantRecu())
                .monnaieRendue(transaction.getMonnaieRendue())
                .tokenRecharge(transaction.getTokenRecharge())
                .dateTransaction(transaction.getDateTransaction())
                .caissiere(transaction.getUtilisateur() != null ?
                        transaction.getUtilisateur().getNom() + " " + transaction.getUtilisateur().getPrenom() : "Systeme")
                .detailsTaxes(detailsTaxes)
                .build();
    }
}
