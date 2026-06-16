package com.sonabel.venkcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PreCalculDTO {
    private BigDecimal montantVerse;
    private BigDecimal montantTaxes;
    private BigDecimal montantNet;
    private BigDecimal coutUnitaireKwh;
    private BigDecimal quantiteKwh;
    private List<DetailTaxeDTO> detailsTaxes;
    private Boolean montantSuffisant;
    private String message;
}
