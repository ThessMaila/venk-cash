package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.entite.Tarif;
import com.sonabel.venkcash.service.TarifService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/tarifs")
@RequiredArgsConstructor
public class ControleurTarif {

    private final TarifService tarifService;

    @GetMapping
    public ResponseEntity<List<Tarif>> listerTous() {
        return ResponseEntity.ok(tarifService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarif> trouverParId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(tarifService.trouverParId(id));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche du tarif {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Tarif> creer(@RequestBody Tarif tarif) {
        try {
            return ResponseEntity.ok(tarifService.creer(tarif));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la creation du tarif: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarif> modifier(@PathVariable Long id, @RequestBody Tarif tarif) {
        try {
            return ResponseEntity.ok(tarifService.modifier(id, tarif));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la modification du tarif {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> desactiver(@PathVariable Long id) {
        try {
            tarifService.desactiver(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Erreur lors de la desactivation du tarif {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
