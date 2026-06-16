package com.sonabel.venkcash.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AchatRequete {
    @NotBlank(message = "Le numero de compteur est requis")
    private String numeroCompteur;

    @NotNull(message = "Le montant verse est requis")
    @DecimalMin(value = "100", message = "Le montant minimum est de 100 FCFA")
    private java.math.BigDecimal montantVerse;

    @NotNull(message = "Le montant recu est requis")
    @DecimalMin(value = "0", message = "Le montant recu doit etre positif")
    private java.math.BigDecimal montantRecu;

    private Boolean envoyerEmail;

    private Boolean envoyerSms;
}
