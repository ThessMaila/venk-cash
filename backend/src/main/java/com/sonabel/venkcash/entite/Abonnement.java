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
@Table(name = "abonnements")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Abonnement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String numeroAbonnement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "abonne_id", nullable = false)
    private Abonne abonne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branchement_id", nullable = false)
    private Branchement branchement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compteur_id", nullable = false)
    private Compteur compteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarif_id", nullable = false)
    private Tarif tarif;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutAbonnement statut;

    @Column(nullable = false)
    private LocalDateTime dateSouscription;

    private LocalDateTime dateResiliation;

    @Column(nullable = false)
    private Boolean actif = true;

    @PrePersist
    protected void onCreate() {
        dateSouscription = LocalDateTime.now();
    }

    public enum StatutAbonnement {
        ACTIF,
        SUSPENDU,
        RESILIE
    }
}
