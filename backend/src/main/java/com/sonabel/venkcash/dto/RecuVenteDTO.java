package com.sonabel.venkcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class RecuVenteDTO {
    private Long id;
    private String numeroRecu;
    private String numeroAbonnement;
    private String nomAbonne;
    private String prenomAbonne;
    private String numeroCompteur;
    private String puissanceSouscrite;
    private BigDecimal montantVerse;
    private BigDecimal montantTaxes;
    private BigDecimal montantNet;
    private BigDecimal coutUnitaireKwh;
    private BigDecimal quantiteKwh;
    private BigDecimal montantRecu;
    private BigDecimal monnaieRendue;
    private String tokenRecharge;
    private LocalDateTime dateTransaction;
    private String caissiere;
    private List<DetailTaxeDTO> detailsTaxes;
}
