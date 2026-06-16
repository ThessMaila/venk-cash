package com.sonabel.venkcash.entite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tarifs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Tarif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String libelle;

    @Column(nullable = false)
    private Integer puissanceAmperes;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal coutUnitaireKwh;

    @Column(nullable = false)
    private Boolean actif = true;
}
