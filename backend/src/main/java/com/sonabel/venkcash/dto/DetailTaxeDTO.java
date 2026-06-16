package com.sonabel.venkcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class DetailTaxeDTO {
    private String libelle;
    private String code;
    private BigDecimal montant;
}
