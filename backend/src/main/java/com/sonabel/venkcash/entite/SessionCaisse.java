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
@Table(name = "sessions_caisse")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SessionCaisse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @Column(nullable = false)
    private LocalDateTime dateOuverture;

    private LocalDateTime dateFermeture;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal soldeInitial;

    @Column(precision = 12, scale = 2)
    private BigDecimal soldeFinal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutSession statut;

    @Column(length = 255)
    private String remarques;

    @PrePersist
    protected void onCreate() {
        dateOuverture = LocalDateTime.now();
        statut = StatutSession.OUVERTE;
    }

    public enum StatutSession {
        OUVERTE,
        FERMEE
    }
}
