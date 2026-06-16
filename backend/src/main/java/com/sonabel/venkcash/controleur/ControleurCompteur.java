package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.entite.Compteur;
import com.sonabel.venkcash.entite.Compteur.StatutCompteur;
import com.sonabel.venkcash.service.CompteurService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/compteurs")
@RequiredArgsConstructor
public class ControleurCompteur {

    private final CompteurService compteurService;

    @GetMapping
    public ResponseEntity<List<Compteur>> listerTous() {
        return ResponseEntity.ok(compteurService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compteur> trouverParId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(compteurService.trouverParId(id));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche du compteur {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/numero/{numero}")
    public ResponseEntity<Compteur> trouverParNumero(@PathVariable String numero) {
        try {
            return ResponseEntity.ok(compteurService.trouverParNumero(numero));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche du compteur par numero {}: {}", numero, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Compteur>> listerParStatut(@PathVariable StatutCompteur statut) {
        return ResponseEntity.ok(compteurService.listerParStatut(statut));
    }

    @PostMapping
    public ResponseEntity<Compteur> creer(@RequestBody Compteur compteur) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(compteurService.creer(compteur));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la creation du compteur: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Compteur> changerStatut(
            @PathVariable Long id, @RequestParam StatutCompteur statut) {
        try {
            return ResponseEntity.ok(compteurService.changerStatut(id, statut));
        } catch (RuntimeException e) {
            log.error("Erreur lors du changement de statut du compteur {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
