package com.sonabel.venkcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class StatistiqueDTO {
    private Long totalAbonnes;
    private Long totalAbonnementsActifs;
    private Long totalCompteursEnStock;
    private Long totalCompteursActifs;
    private BigDecimal totalKwhVendusAujourdhui;
    private BigDecimal totalChiffreAffaireAujourdhui;
    private BigDecimal totalKwhVendusSemaine;
    private BigDecimal totalChiffreAffaireSemaine;
    private BigDecimal totalKwhVendusMois;
    private BigDecimal totalChiffreAffaireMois;
}
