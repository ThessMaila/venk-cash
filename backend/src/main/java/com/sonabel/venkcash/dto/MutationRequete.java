package com.sonabel.venkcash.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MutationRequete {
    @NotNull(message = "L'ID de l'abonnement actuel est requis")
    private Long abonnementActuelId;

    @NotBlank(message = "Le nom du nouvel abonne est requis")
    private String nouveauNom;

    @NotBlank(message = "Le prenom du nouvel abonne est requis")
    private String nouveauPrenom;

    private String nouvelEmail;

    private String nouveauTelephone;

    private String nouvelleAdresse;
}
