package com.sonabel.venkcash.entite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions_achat")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TransactionAchat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String codeTransaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "abonnement_id", nullable = false)
    private Abonnement abonnement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montantVerse;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montantTaxes;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montantNet;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal coutUnitaireKwh;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantiteKwh;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montantRecu;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monnaieRendue;

    @Column(nullable = false, length = 20)
    private String tokenRecharge;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutTransaction statut;

    @Column(nullable = false)
    private LocalDateTime dateTransaction;

    @Column(length = 255)
    private String commentaire;

    @PrePersist
    protected void onCreate() {
        dateTransaction = LocalDateTime.now();
    }

    public enum StatutTransaction {
        VALIDEE,
        ANNULEE,
        EN_ATTENTE
    }
}
