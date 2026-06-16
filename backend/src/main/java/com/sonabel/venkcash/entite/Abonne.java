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
@Table(name = "abonnes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Abonne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String telephone;

    @Column(length = 200)
    private String adresse;

    private LocalDateTime dateCreation;

    @Column(nullable = false)
    private Boolean actif = true;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }
}
