package com.sonabel.venkcash.service;

import com.sonabel.venkcash.dto.DetailTaxeDTO;
import com.sonabel.venkcash.dto.PreCalculDTO;
import com.sonabel.venkcash.entite.GrilleTarifaire;
import com.sonabel.venkcash.entite.Tarif;
import com.sonabel.venkcash.repository.GrilleTarifaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MoteurCalculKwh {

    private final GrilleTarifaireRepository grilleTarifaireRepository;

    public PreCalculDTO calculer(BigDecimal montantVerse, Tarif tarif) {
        List<DetailTaxeDTO> detailsTaxes = new ArrayList<>();
        BigDecimal montantTaxes = BigDecimal.ZERO;

        List<GrilleTarifaire> taxes = grilleTarifaireRepository.findByActifTrue();

        for (GrilleTarifaire taxe : taxes) {
            BigDecimal montantTaxe;
            if (taxe.getType() == GrilleTarifaire.TypeTaxe.POURCENTAGE) {
                montantTaxe = montantVerse.multiply(taxe.getValeur())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            } else {
                montantTaxe = taxe.getValeur();
            }
            montantTaxes = montantTaxes.add(montantTaxe);
            detailsTaxes.add(new DetailTaxeDTO(taxe.getLibelleTaxe(), taxe.getCodeTaxe(), montantTaxe));
        }

        BigDecimal montantNet = montantVerse.subtract(montantTaxes);

        if (montantNet.compareTo(BigDecimal.ZERO) <= 0) {
            return PreCalculDTO.builder()
                    .montantVerse(montantVerse)
                    .montantTaxes(montantTaxes)
                    .montantNet(BigDecimal.ZERO)
                    .coutUnitaireKwh(tarif.getCoutUnitaireKwh())
                    .quantiteKwh(BigDecimal.ZERO)
                    .detailsTaxes(detailsTaxes)
                    .montantSuffisant(false)
                    .message("Le montant verse est insuffisant pour couvrir les taxes et redevances")
                    .build();
        }

        BigDecimal quantiteKwh = montantNet.divide(tarif.getCoutUnitaireKwh(), 2, RoundingMode.HALF_UP);

        return PreCalculDTO.builder()
                .montantVerse(montantVerse)
                .montantTaxes(montantTaxes)
                .montantNet(montantNet)
                .coutUnitaireKwh(tarif.getCoutUnitaireKwh())
                .quantiteKwh(quantiteKwh)
                .detailsTaxes(detailsTaxes)
                .montantSuffisant(true)
                .message("Calcul effectue avec succes")
                .build();
    }
}
