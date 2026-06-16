package com.sonabel.venkcash.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConnexionRequete {
    @NotBlank(message = "Le nom d'utilisateur est requis")
    private String nomUtilisateur;

    @NotBlank(message = "Le mot de passe est requis")
    private String motDePasse;
}
