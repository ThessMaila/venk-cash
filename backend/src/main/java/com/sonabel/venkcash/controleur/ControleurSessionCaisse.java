package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.entite.SessionCaisse;
import com.sonabel.venkcash.security.JwtService;
import com.sonabel.venkcash.service.SessionCaisseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/sessions-caisse")
@RequiredArgsConstructor
public class ControleurSessionCaisse {

    private final SessionCaisseService sessionService;
    private final JwtService jwtService;

    @PostMapping("/ouverture")
    public ResponseEntity<?> ouvrirSession(
            @RequestBody Map<String, BigDecimal> requete,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String nomUtilisateur = extraireNomUtilisateur(authHeader);
            SessionCaisse session = sessionService.ouvrirSession(
                    nomUtilisateur, requete.getOrDefault("soldeInitial", BigDecimal.ZERO));
            return ResponseEntity.status(HttpStatus.CREATED).body(session);
        } catch (RuntimeException e) {
            log.error("Erreur lors de l'ouverture de session: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/fermeture")
    public ResponseEntity<?> fermerSession(
            @RequestBody Map<String, String> requete,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String nomUtilisateur = extraireNomUtilisateur(authHeader);
            SessionCaisse session = sessionService.fermerSession(
                    nomUtilisateur, requete.getOrDefault("remarques", ""));
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la fermeture de session: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/recapitulatif")
    public ResponseEntity<?> obtenirRecapitulatif(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String nomUtilisateur = extraireNomUtilisateur(authHeader);
            Map<String, Object> recap = sessionService.obtenirRecapitulatifSession(nomUtilisateur);
            return ResponseEntity.ok(recap);
        } catch (RuntimeException e) {
            log.error("Erreur lors du recapitulatif de session: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/historique")
    public ResponseEntity<List<SessionCaisse>> historique(
            @RequestHeader("Authorization") String authHeader) {
        String nomUtilisateur = extraireNomUtilisateur(authHeader);
        return ResponseEntity.ok(sessionService.historiqueSessions(nomUtilisateur));
    }

    private String extraireNomUtilisateur(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtService.extraireNomUtilisateur(authHeader.substring(7));
        }
        return "Systeme";
    }
}
