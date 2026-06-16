package com.sonabel.venkcash.service;

import com.sonabel.venkcash.entite.SessionCaisse;
import com.sonabel.venkcash.entite.SessionCaisse.StatutSession;
import com.sonabel.venkcash.entite.Utilisateur;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.SessionCaisseRepository;
import com.sonabel.venkcash.repository.TransactionAchatRepository;
import com.sonabel.venkcash.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SessionCaisseService {

    private final SessionCaisseRepository sessionRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final TransactionAchatRepository transactionRepository;

    public SessionCaisse trouverSessionOuverte(String nomUtilisateur) {
        Utilisateur utilisateur = utilisateurRepository.findByNomUtilisateur(nomUtilisateur)
                .orElseThrow(() -> new ExceptionMetier("Utilisateur non trouve"));
        return sessionRepository.findByUtilisateurAndStatut(utilisateur, StatutSession.OUVERTE)
                .orElseThrow(() -> new ExceptionMetier("Aucune session ouverte trouvee"));
    }

    @Transactional
    public SessionCaisse ouvrirSession(String nomUtilisateur, BigDecimal soldeInitial) {
        Utilisateur utilisateur = utilisateurRepository.findByNomUtilisateur(nomUtilisateur)
                .orElseThrow(() -> new ExceptionMetier("Utilisateur non trouve"));

        if (sessionRepository.findByUtilisateurAndStatut(utilisateur, StatutSession.OUVERTE).isPresent()) {
            throw new ExceptionMetier("Une session est deja ouverte pour cet utilisateur");
        }

        SessionCaisse session = SessionCaisse.builder()
                .utilisateur(utilisateur)
                .soldeInitial(soldeInitial)
                .statut(StatutSession.OUVERTE)
                .build();

        return sessionRepository.save(session);
    }

    @Transactional
    public SessionCaisse fermerSession(String nomUtilisateur, String remarques) {
        SessionCaisse session = trouverSessionOuverte(nomUtilisateur);
        session.setDateFermeture(LocalDateTime.now());
        session.setStatut(StatutSession.FERMEE);
        session.setRemarques(remarques);

        BigDecimal totalVentes = transactionRepository.totalChiffreAffaireEntre(
                session.getDateOuverture(), LocalDateTime.now());
        if (totalVentes == null) totalVentes = BigDecimal.ZERO;

        session.setSoldeFinal(session.getSoldeInitial().add(totalVentes));
        return sessionRepository.save(session);
    }

    public Map<String, Object> obtenirRecapitulatifSession(String nomUtilisateur) {
        SessionCaisse session = trouverSessionOuverte(nomUtilisateur);
        Map<String, Object> recap = new HashMap<>();

        BigDecimal totalKwh = transactionRepository.totalKwhVendusEntre(
                session.getDateOuverture(), LocalDateTime.now());
        BigDecimal totalVentes = transactionRepository.totalChiffreAffaireEntre(
                session.getDateOuverture(), LocalDateTime.now());
        long nombreTransactions = transactionRepository.totalKwhVendusEntre(
                session.getDateOuverture(), LocalDateTime.now()) != null
                ? transactionRepository.totalChiffreAffaireEntre(
                        session.getDateOuverture(), LocalDateTime.now()).longValue()
                : transactionRepository.findByDateTransactionBetween(
                        session.getDateOuverture(), LocalDateTime.now()).stream()
                        .filter(t -> t.getStatut().name().equals("VALIDEE")).count();

        if (totalKwh == null) totalKwh = BigDecimal.ZERO;
        if (totalVentes == null) totalVentes = BigDecimal.ZERO;

        recap.put("session", session);
        recap.put("totalKwh", totalKwh);
        recap.put("totalVentes", totalVentes);
        recap.put("nombreTransactions", nombreTransactions);
        recap.put("soldeAttendu", session.getSoldeInitial().add(totalVentes));

        return recap;
    }

    public List<SessionCaisse> historiqueSessions(String nomUtilisateur) {
        Utilisateur utilisateur = utilisateurRepository.findByNomUtilisateur(nomUtilisateur)
                .orElseThrow(() -> new ExceptionMetier("Utilisateur non trouve"));
        return sessionRepository.findByUtilisateurOrderByDateOuvertureDesc(utilisateur);
    }
}
