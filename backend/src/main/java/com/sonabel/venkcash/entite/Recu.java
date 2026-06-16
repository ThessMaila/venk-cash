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
@Table(name = "recus")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Recu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String numeroRecu;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private TransactionAchat transaction;

    @Column(nullable = false)
    private LocalDateTime dateEdition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ModeEnvoi modeEnvoi;

    @Column(length = 100)
    private String destinataire;

    @Column(nullable = false)
    private Boolean imprime = false;

    @Column(nullable = false)
    private Boolean envoye = false;

    @PrePersist
    protected void onCreate() {
        dateEdition = LocalDateTime.now();
    }

    public enum ModeEnvoi {
        IMPRESSION,
        EMAIL,
        SMS,
        EMAIL_ET_SMS
    }
}
