package com.sonabel.venkcash.entite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "compteurs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Compteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String numeroCompteur;

    @Column(length = 50)
    private String numeroSerie;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutCompteur statut;

    @Column(length = 200)
    private String emplacement;

    public enum StatutCompteur {
        EN_STOCK,
        ACTIF,
        SUSPENDU,
        RESILIE
    }
}
