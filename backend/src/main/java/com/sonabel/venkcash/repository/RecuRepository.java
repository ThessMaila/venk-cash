package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.Recu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RecuRepository extends JpaRepository<Recu, Long> {
    Optional<Recu> findByNumeroRecu(String numeroRecu);
    Optional<Recu> findByTransactionId(Long transactionId);
    List<Recu> findByEnvoyeFalse();
    List<Recu> findByImprimeFalse();
}
