package com.sonabel.venkcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class TransactionRecenteDTO {
    private String codeTransaction;
    private String nomAbonne;
    private String prenomAbonne;
    private String numeroCompteur;
    private BigDecimal montantVerse;
    private BigDecimal quantiteKwh;
    private LocalDateTime dateTransaction;
    private String statut;
    private String caissiere;
}
