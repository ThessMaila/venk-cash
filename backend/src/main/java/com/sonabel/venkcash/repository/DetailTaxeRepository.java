package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.DetailTaxe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetailTaxeRepository extends JpaRepository<DetailTaxe, Long> {
    List<DetailTaxe> findByTransactionId(Long transactionId);
}
