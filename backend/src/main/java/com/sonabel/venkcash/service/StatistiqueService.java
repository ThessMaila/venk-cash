package com.sonabel.venkcash.service;

import com.sonabel.venkcash.dto.StatistiqueDTO;
import com.sonabel.venkcash.entite.Compteur.StatutCompteur;
import com.sonabel.venkcash.entite.Abonnement;
import com.sonabel.venkcash.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class StatistiqueService {

    private final TransactionAchatRepository transactionRepository;
    private final AbonneRepository abonneRepository;
    private final AbonnementRepository abonnementRepository;
    private final CompteurRepository compteurRepository;

    public StatistiqueDTO obtenirStatistiques() {
        LocalDate aujourdhui = LocalDate.now();
        LocalDate debutSemaine = aujourdhui.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate debutMois = aujourdhui.withDayOfMonth(1);

        return StatistiqueDTO.builder()
                .totalAbonnes(abonneRepository.count())
                .totalAbonnementsActifs(abonnementRepository.countByActifTrue())
                .totalCompteursEnStock(compteurRepository.countByStatut(StatutCompteur.EN_STOCK))
                .totalCompteursActifs(compteurRepository.countByStatut(StatutCompteur.ACTIF))
                .totalKwhVendusAujourdhui(
                        transactionRepository.totalKwhVendusEntre(
                                aujourdhui.atStartOfDay(), aujourdhui.atTime(LocalTime.MAX)))
                .totalChiffreAffaireAujourdhui(
                        transactionRepository.totalChiffreAffaireEntre(
                                aujourdhui.atStartOfDay(), aujourdhui.atTime(LocalTime.MAX)))
                .totalKwhVendusSemaine(
                        transactionRepository.totalKwhVendusEntre(
                                debutSemaine.atStartOfDay(), aujourdhui.atTime(LocalTime.MAX)))
                .totalChiffreAffaireSemaine(
                        transactionRepository.totalChiffreAffaireEntre(
                                debutSemaine.atStartOfDay(), aujourdhui.atTime(LocalTime.MAX)))
                .totalKwhVendusMois(
                        transactionRepository.totalKwhVendusEntre(
                                debutMois.atStartOfDay(), aujourdhui.atTime(LocalTime.MAX)))
                .totalChiffreAffaireMois(
                        transactionRepository.totalChiffreAffaireEntre(
                                debutMois.atStartOfDay(), aujourdhui.atTime(LocalTime.MAX)))
                .build();
    }
}
