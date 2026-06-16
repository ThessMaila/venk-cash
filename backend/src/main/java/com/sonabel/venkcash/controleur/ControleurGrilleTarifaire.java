package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.entite.GrilleTarifaire;
import com.sonabel.venkcash.service.GrilleTarifaireService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/grille-tarifaire")
@RequiredArgsConstructor
public class ControleurGrilleTarifaire {

    private final GrilleTarifaireService grilleTarifaireService;

    @GetMapping
    public ResponseEntity<List<GrilleTarifaire>> listerToutes() {
        return ResponseEntity.ok(grilleTarifaireService.listerToutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrilleTarifaire> trouverParId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(grilleTarifaireService.trouverParId(id));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche de la taxe {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<GrilleTarifaire> creer(@RequestBody GrilleTarifaire grilleTarifaire) {
        try {
            return ResponseEntity.ok(grilleTarifaireService.creer(grilleTarifaire));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la creation de la taxe: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<GrilleTarifaire> modifier(@PathVariable Long id, @RequestBody GrilleTarifaire grille) {
        try {
            return ResponseEntity.ok(grilleTarifaireService.modifier(id, grille));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la modification de la taxe {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> desactiver(@PathVariable Long id) {
        try {
            grilleTarifaireService.desactiver(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Erreur lors de la desactivation de la taxe {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
