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
@Table(name = "details_taxes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DetailTaxe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private TransactionAchat transaction;

    @Column(nullable = false, length = 100)
    private String libelleTaxe;

    @Column(nullable = false, length = 50)
    private String codeTaxe;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;
}
