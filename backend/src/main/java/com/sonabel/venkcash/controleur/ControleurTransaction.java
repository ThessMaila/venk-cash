package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.dto.*;
import com.sonabel.venkcash.entite.TransactionAchat;
import com.sonabel.venkcash.security.JwtService;
import com.sonabel.venkcash.service.RecuService;
import com.sonabel.venkcash.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class ControleurTransaction {

    private final TransactionService transactionService;
    private final RecuService recuService;
    private final JwtService jwtService;

    @PostMapping("/pre-calcul")
    public ResponseEntity<?> preCalculer(@Valid @RequestBody AchatRequete requete) {
        try {
            PreCalculDTO preCalcul = transactionService.preCalculer(requete);
            return ResponseEntity.ok(preCalcul);
        } catch (RuntimeException e) {
            log.error("Erreur lors du pre-calcul: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ReponseErreur(e.getMessage()));
        }
    }

    @PostMapping("/effectuer")
    public ResponseEntity<?> effectuerAchat(
            @Valid @RequestBody AchatRequete requete,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String nomUtilisateur = extraireNomUtilisateur(authHeader);
            RecuVenteDTO recu = transactionService.effectuerAchat(requete, nomUtilisateur);
            return ResponseEntity.status(HttpStatus.CREATED).body(recu);
        } catch (RuntimeException e) {
            log.error("Erreur lors de l'achat: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ReponseErreur(e.getMessage()));
        }
    }

    @PostMapping("/{id}/annuler")
    public ResponseEntity<?> annuler(@PathVariable Long id) {
        try {
            RecuVenteDTO recu = transactionService.annulerAchat(id);
            return ResponseEntity.ok(recu);
        } catch (RuntimeException e) {
            log.error("Erreur lors de l'annulation {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(new ReponseErreur(e.getMessage()));
        }
    }

    @GetMapping("/recentes")
    public ResponseEntity<List<TransactionRecenteDTO>> listerRecentes() {
        return ResponseEntity.ok(transactionService.listerTransactionsRecentes());
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> telechargerPdf(@PathVariable Long id) {
        try {
            TransactionAchat transaction = transactionService.trouverParId(id);
            byte[] pdf = recuService.genererPdf(transaction);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=recu-" + transaction.getCodeTransaction() + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la generation du PDF {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/abonnement/{abonnementId}")
    public ResponseEntity<?> listerParAbonnement(@PathVariable Long abonnementId) {
        try {
            return ResponseEntity.ok(transactionService.listerParAbonnement(abonnementId));
        } catch (RuntimeException e) {
            log.error("Erreur lors du listage des transactions pour l'abonnement {}: {}", abonnementId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    private String extraireNomUtilisateur(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtService.extraireNomUtilisateur(token);
        }
        return "Systeme";
    }
}
