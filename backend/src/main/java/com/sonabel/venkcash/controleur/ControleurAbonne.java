package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.entite.Abonne;
import com.sonabel.venkcash.service.AbonneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/abonnes")
@RequiredArgsConstructor
public class ControleurAbonne {

    private final AbonneService abonneService;

    @GetMapping
    public ResponseEntity<List<Abonne>> listerTous() {
        return ResponseEntity.ok(abonneService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Abonne> trouverParId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(abonneService.trouverParId(id));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche de l'abonne {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<Abonne>> rechercherParNom(@RequestParam String nom) {
        return ResponseEntity.ok(abonneService.rechercherParNom(nom));
    }

    @PostMapping
    public ResponseEntity<Abonne> creer(@RequestBody Abonne abonne) {
        return ResponseEntity.status(HttpStatus.CREATED).body(abonneService.creer(abonne));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Abonne> modifier(@PathVariable Long id, @RequestBody Abonne abonne) {
        try {
            return ResponseEntity.ok(abonneService.modifier(id, abonne));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la modification de l'abonne {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> desactiver(@PathVariable Long id) {
        try {
            abonneService.desactiver(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Erreur lors de la desactivation de l'abonne {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
