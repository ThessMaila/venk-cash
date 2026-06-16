package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.dto.*;
import com.sonabel.venkcash.entite.Abonnement;
import com.sonabel.venkcash.service.AbonnementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/abonnements")
@RequiredArgsConstructor
public class ControleurAbonnement {

    private final AbonnementService abonnementService;

    @GetMapping
    public ResponseEntity<List<Abonnement>> listerTous() {
        return ResponseEntity.ok(abonnementService.listerTous());
    }

    @GetMapping("/actifs")
    public ResponseEntity<List<Abonnement>> listerActifs() {
        return ResponseEntity.ok(abonnementService.listerActifs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Abonnement> trouverParId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(abonnementService.trouverParId(id));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche de l'abonnement {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/compteur/{numeroCompteur}")
    public ResponseEntity<Abonnement> trouverParCompteur(@PathVariable String numeroCompteur) {
        try {
            return ResponseEntity.ok(abonnementService.trouverParNumeroCompteur(numeroCompteur));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche par compteur {}: {}", numeroCompteur, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/souscription")
    public ResponseEntity<?> souscrire(@Valid @RequestBody SouscriptionRequete requete) {
        try {
            Abonnement abonnement = abonnementService.souscrire(requete);
            return ResponseEntity.status(HttpStatus.CREATED).body(abonnement);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la souscription: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ReponseErreur(e.getMessage()));
        }
    }

    @PostMapping("/changement-puissance")
    public ResponseEntity<?> changerPuissance(@Valid @RequestBody ChangementPuissanceRequete requete) {
        try {
            Abonnement abonnement = abonnementService.changerPuissance(requete);
            return ResponseEntity.ok(abonnement);
        } catch (RuntimeException e) {
            log.error("Erreur lors du changement de puissance: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ReponseErreur(e.getMessage()));
        }
    }

    @PostMapping("/mutation")
    public ResponseEntity<?> muter(@Valid @RequestBody MutationRequete requete) {
        try {
            Abonnement abonnement = abonnementService.muterAbonne(requete);
            return ResponseEntity.ok(abonnement);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la mutation: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ReponseErreur(e.getMessage()));
        }
    }
}
