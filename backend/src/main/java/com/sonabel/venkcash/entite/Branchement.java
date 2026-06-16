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
@Table(name = "branchements")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Branchement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String codeBranchement;

    @Column(length = 200)
    private String adresse;

    @Column(length = 100)
    private String quartier;

    @Column(length = 100)
    private String ville;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutBranchement statut;

    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }

    public enum StatutBranchement {
        ACTIF,
        INACTIF,
        RESILIE
    }
}
