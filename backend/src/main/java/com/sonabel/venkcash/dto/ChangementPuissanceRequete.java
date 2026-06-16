package com.sonabel.venkcash.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ChangementPuissanceRequete {
    @NotNull(message = "L'ID de l'abonnement est requis")
    private Long abonnementId;

    @NotNull(message = "La nouvelle puissance est requise")
    @Min(value = 3, message = "Puissance minimale : 3A")
    @Max(value = 5, message = "Puissance maximale : 5A")
    private Integer nouvellePuissance;
}
