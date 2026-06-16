package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.TransactionAchat;
import com.sonabel.venkcash.entite.TransactionAchat.StatutTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionAchatRepository extends JpaRepository<TransactionAchat, Long> {
    List<TransactionAchat> findTop20ByOrderByDateTransactionDesc();
    List<TransactionAchat> findByAbonnementIdOrderByDateTransactionDesc(Long abonnementId);
    List<TransactionAchat> findByUtilisateurIdOrderByDateTransactionDesc(Long utilisateurId);
    List<TransactionAchat> findByDateTransactionBetween(LocalDateTime debut, LocalDateTime fin);
    List<TransactionAchat> findByStatut(StatutTransaction statut);

    @Query("SELECT COALESCE(SUM(t.quantiteKwh), 0) FROM TransactionAchat t WHERE t.statut = 'VALIDEE' AND t.dateTransaction BETWEEN :debut AND :fin")
    BigDecimal totalKwhVendusEntre(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(t.montantNet), 0) FROM TransactionAchat t WHERE t.statut = 'VALIDEE' AND t.dateTransaction BETWEEN :debut AND :fin")
    BigDecimal totalChiffreAffaireEntre(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
}
