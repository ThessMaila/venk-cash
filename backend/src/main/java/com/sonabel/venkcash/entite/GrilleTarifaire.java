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
@Table(name = "grille_tarifaire")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class GrilleTarifaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String libelleTaxe;

    @Column(nullable = false, length = 50)
    private String codeTaxe;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TypeTaxe type;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal valeur;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(length = 255)
    private String description;

    public enum TypeTaxe {
        POURCENTAGE,
        MONTANT_FIXE
    }
}
