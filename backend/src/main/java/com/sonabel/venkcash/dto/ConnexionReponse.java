package com.sonabel.venkcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ConnexionReponse {
    private String token;
    private String type;
    private Long id;
    private String nomUtilisateur;
    private String email;
    private String profil;
    private String nom;
    private String prenom;
}
