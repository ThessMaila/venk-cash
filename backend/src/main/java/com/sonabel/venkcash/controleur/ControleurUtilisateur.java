package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.entite.Utilisateur;
import com.sonabel.venkcash.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class ControleurUtilisateur {

    private final UtilisateurService utilisateurService;

    @GetMapping
    public ResponseEntity<List<Utilisateur>> listerTous() {
        return ResponseEntity.ok(utilisateurService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> trouverParId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(utilisateurService.trouverParId(id));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche de l'utilisateur {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Utilisateur> creer(@RequestBody Utilisateur utilisateur) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(utilisateurService.creer(utilisateur));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la creation de l'utilisateur: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> desactiver(@PathVariable Long id) {
        try {
            utilisateurService.supprimer(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Erreur lors de la desactivation de l'utilisateur {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
