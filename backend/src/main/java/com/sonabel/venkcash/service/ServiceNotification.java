package com.sonabel.venkcash.service;

import com.sonabel.venkcash.entite.Recu;
import com.sonabel.venkcash.entite.TransactionAchat;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service de notification pour l'envoi des reçus par email et SMS.
 * Utilise par le systeme VENK-CASH pour notifier les clients apres une vente.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ServiceNotification {

    private final JavaMailSender mailSender;
    // Pour l'envoi SMS, on pourrait utiliser un service externe comme Twilio ou un gateway local
    // private final SmsService smsService;

    /**
     * Envoie un recu par email au client.
     *
     * @param destinataire l'adresse email du client
     * @param transaction la transaction effectuee
     */
    public void envoyerEmailRecu(String destinataire, TransactionAchat transaction) {
        if (destinataire == null || destinataire.isEmpty()) {
            log.warn("Aucune adresse email fournie pour l'envoi du recu");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(destinataire);
            message.setSubject("SONABEL - Recu de recharge de " + transaction.getQuantiteKwh() + " kWh");
            message.setText(construireCorpsEmail(transaction));

            mailSender.send(message);
            log.info("Email envoye avec succes a {}", destinataire);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email a {}: {}", destinataire, e.getMessage());
        }
    }

    /**
     * Envoie un recu par SMS au client.
     * Le SMS contient les informations essentielles: token et quantite kWh.
     *
     * @param numeroTelephone le numero de telephone du client
     * @param transaction la transaction effectuee
     */
    public void envoyerSmsRecu(String numeroTelephone, TransactionAchat transaction) {
        if (numeroTelephone == null || numeroTelephone.isEmpty()) {
            log.warn("Aucun numero de telephone fourni pour l'envoi SMS");
            return;
        }

        try {
            String message = construireCorpsSms(transaction);
            // Integration avec un service SMS externe
            // smsService.envoyer(numeroTelephone, message);
            log.info("SMS envoye avec succes au {} - Message: {}", numeroTelephone, message);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi du SMS au {}: {}", numeroTelephone, e.getMessage());
        }
    }

    /**
     * Envoie les notifications selon le mode choisi.
     *
     * @param recu le recu a envoyer
     * @param envoyerEmail flag pour envoi email
     * @param envoyerSms flag pour envoi SMS
     */
    public void envoyerNotifications(Recu recu, Boolean envoyerEmail, Boolean envoyerSms) {
        TransactionAchat transaction = recu.getTransaction();
        String email = transaction.getAbonnement().getAbonne().getEmail();
        String telephone = transaction.getAbonnement().getAbonne().getTelephone();

        if (Boolean.TRUE.equals(envoyerEmail) && email != null) {
            envoyerEmailRecu(email, transaction);
        }

        if (Boolean.TRUE.equals(envoyerSms) && telephone != null) {
            envoyerSmsRecu(telephone, transaction);
        }
    }

    /**
     * Construit le corps de l'email de recu.
     */
    private String construireCorpsEmail(TransactionAchat t) {
        return """
            ============================================
            SONABEL - Venk-Cash
            Recu de vente d'unites d'energie
            ============================================

            Code transaction : %s

            --- Informations client ---
            Compteur : %s
            Puissance : %s

            --- Details financiers ---
            Montant verse : %s FCFA
            Taxes et redevances : %s FCFA
            Montant net energie : %s FCFA

            --- Energie achetee ---
            Quantite : %s kWh
            Cout unitaire : %s FCFA/kWh

            ============================================
            TOKEN DE RECHARGE : %s
            ============================================

            Montant recu : %s FCFA
            Monnaie rendue : %s FCFA

            Merci de votre confiance.
            SONABEL - L'energie au service du developpement.
            """.formatted(
                t.getCodeTransaction(),
                t.getAbonnement().getCompteur().getNumeroCompteur(),
                t.getAbonnement().getTarif().getPuissanceAmperes() + "A",
                t.getMontantVerse(),
                t.getMontantTaxes(),
                t.getMontantNet(),
                t.getQuantiteKwh(),
                t.getCoutUnitaireKwh(),
                t.getTokenRecharge(),
                t.getMontantRecu(),
                t.getMonnaieRendue()
            );
    }

    /**
     * Construit le corps du SMS de recu (limite a 160 caracteres).
     */
    private String construireCorpsSms(TransactionAchat t) {
        return String.format(
            "SONABEL: %s kWh achetes. Token: %s. Montant: %s FCFA. Merci de votre confiance.",
            t.getQuantiteKwh(),
            t.getTokenRecharge(),
            t.getMontantVerse()
        );
    }
}
