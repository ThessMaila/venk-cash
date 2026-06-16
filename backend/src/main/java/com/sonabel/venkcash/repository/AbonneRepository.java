package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.Abonne;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AbonneRepository extends JpaRepository<Abonne, Long> {
    List<Abonne> findByNomContainingIgnoreCase(String nom);
    List<Abonne> findByPrenomContainingIgnoreCase(String prenom);
    List<Abonne> findByEmail(String email);
    List<Abonne> findByTelephone(String telephone);
}
