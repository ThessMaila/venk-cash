package com.sonabel.venkcash.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SouscriptionRequete {
    @NotBlank(message = "Le nom est requis")
    private String nom;

    @NotBlank(message = "Le prenom est requis")
    private String prenom;

    @Email(message = "Email invalide")
    private String email;

    private String telephone;

    private String adresse;

    @NotBlank(message = "Le code de branchement est requis")
    private String codeBranchement;

    @NotNull(message = "La puissance est requise")
    @Min(value = 3, message = "Puissance minimale : 3A")
    @Max(value = 5, message = "Puissance maximale : 5A")
    private Integer puissanceAmperes;

    @NotBlank(message = "Le numero de compteur est requis")
    private String numeroCompteur;
}
