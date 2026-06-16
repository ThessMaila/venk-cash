package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.entite.Branchement;
import com.sonabel.venkcash.service.BranchementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/branchements")
@RequiredArgsConstructor
public class ControleurBranchement {

    private final BranchementService branchementService;

    @GetMapping
    public ResponseEntity<List<Branchement>> listerTous() {
        return ResponseEntity.ok(branchementService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Branchement> trouverParId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(branchementService.trouverParId(id));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche du branchement {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Branchement> trouverParCode(@PathVariable String code) {
        try {
            return ResponseEntity.ok(branchementService.trouverParCode(code));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la recherche du branchement par code {}: {}", code, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Branchement> creer(@RequestBody Branchement branchement) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(branchementService.creer(branchement));
        } catch (RuntimeException e) {
            log.error("Erreur lors de la creation du branchement: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
