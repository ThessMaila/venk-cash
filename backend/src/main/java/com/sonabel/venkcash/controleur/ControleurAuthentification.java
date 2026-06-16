package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.dto.ConnexionReponse;
import com.sonabel.venkcash.dto.ConnexionRequete;
import com.sonabel.venkcash.service.UtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ControleurAuthentification {

    private final UtilisateurService utilisateurService;

    @PostMapping("/connexion")
    public ResponseEntity<ConnexionReponse> connecter(@Valid @RequestBody ConnexionRequete requete) {
        try {
            ConnexionReponse reponse = utilisateurService.connecter(requete);
            return ResponseEntity.ok(reponse);
        } catch (RuntimeException e) {
            log.error("Erreur d'authentification pour {}: {}", requete.getNomUtilisateur(), e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
