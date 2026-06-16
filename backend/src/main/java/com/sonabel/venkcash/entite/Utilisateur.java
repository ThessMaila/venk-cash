package com.sonabel.venkcash.entite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "utilisateurs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String nomUtilisateur;

    @Column(nullable = false)
    private String motDePasse;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 50)
    private String nom;

    @Column(length = 100)
    private String prenom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Profil profil;

    @Column(nullable = false)
    private Boolean actif = true;

    private LocalDateTime dateCreation;

    private LocalDateTime derniereConnexion;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }

    public enum Profil {
        CAISSIERE,
        CHEF_GUICHET,
        ADMINISTRATEUR
    }
}
