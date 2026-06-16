package com.sonabel.venkcash.service;

import com.sonabel.venkcash.entite.DetailTaxe;
import com.sonabel.venkcash.entite.Recu;
import com.sonabel.venkcash.entite.TransactionAchat;
import com.sonabel.venkcash.repository.DetailTaxeRepository;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.RecuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecuService {

    private final RecuRepository recuRepository;
    private final DetailTaxeRepository detailTaxeRepository;
    private final JavaMailSender mailSender;

    public Recu trouverParId(Long id) {
        return recuRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Recu non trouve"));
    }

    public Recu trouverParNumero(String numeroRecu) {
        return recuRepository.findByNumeroRecu(numeroRecu)
                .orElseThrow(() -> new ExceptionMetier("Recu non trouve"));
    }

    public void marquerImprime(Long id) {
        Recu recu = trouverParId(id);
        recu.setImprime(true);
        recuRepository.save(recu);
    }

    public byte[] genererPdf(TransactionAchat transaction) {
        List<DetailTaxe> detailsTaxes = detailTaxeRepository.findByTransactionId(transaction.getId());

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A5);
            document.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                PDType1Font fontGras = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font fontNormal = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                // Titre
                cs.setFont(fontGras, 16);
                cs.beginText();
                cs.newLineAtOffset(20, page.getMediaBox().getHeight() - 30);
                cs.showText("SONABEL - Venk-Cash");
                cs.endText();

                // Sous-titre
                cs.setFont(fontNormal, 8);
                cs.beginText();
                cs.newLineAtOffset(20, page.getMediaBox().getHeight() - 45);
                cs.showText("Reçu de vente - " + transaction.getDateTransaction().toString());
                cs.endText();

                // Ligne de separation
                cs.setLineWidth(1);
                cs.moveTo(20, page.getMediaBox().getHeight() - 55);
                cs.lineTo(page.getMediaBox().getWidth() - 20, page.getMediaBox().getHeight() - 55);
                cs.stroke();

                float y = page.getMediaBox().getHeight() - 75;
                float hauteurLigne = 14;

                // Abonne
                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Abonne:"); cs.endText();
                cs.setFont(fontNormal, 10);
                cs.beginText(); cs.newLineAtOffset(120, y);
                cs.showText(transaction.getAbonnement().getAbonne().getNom() + " "
                        + transaction.getAbonnement().getAbonne().getPrenom());
                cs.endText();
                y -= hauteurLigne;

                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("N Compteur:"); cs.endText();
                cs.setFont(fontNormal, 10);
                cs.beginText(); cs.newLineAtOffset(120, y);
                cs.showText(transaction.getAbonnement().getCompteur().getNumeroCompteur());
                cs.endText();
                y -= hauteurLigne;

                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Puissance:"); cs.endText();
                cs.setFont(fontNormal, 10);
                cs.beginText(); cs.newLineAtOffset(120, y);
                cs.showText(transaction.getAbonnement().getTarif().getPuissanceAmperes() + "A");
                cs.endText();
                y -= hauteurLigne + 10;

                // Détails financiers
                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Montant verse:"); cs.endText();
                cs.setFont(fontNormal, 10);
                cs.beginText(); cs.newLineAtOffset(120, y);
                cs.showText(transaction.getMontantVerse() + " FCFA");
                cs.endText();
                y -= hauteurLigne;

                // Taxes
                for (DetailTaxe dt : detailsTaxes) {
                    cs.setFont(fontNormal, 9);
                    cs.beginText(); cs.newLineAtOffset(20, y);
                    cs.showText("  - " + dt.getLibelleTaxe() + " (" + dt.getCodeTaxe() + "):");
                    cs.endText();
                    cs.beginText(); cs.newLineAtOffset(160, y);
                    cs.showText("- " + dt.getMontant() + " FCFA");
                    cs.endText();
                    y -= hauteurLigne - 2;
                }

                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Total taxes:"); cs.endText();
                cs.setFont(fontNormal, 10);
                cs.beginText(); cs.newLineAtOffset(120, y);
                cs.showText("- " + transaction.getMontantTaxes() + " FCFA");
                cs.endText();
                y -= hauteurLigne;

                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Montant net energie:"); cs.endText();
                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(160, y);
                cs.showText(transaction.getMontantNet() + " FCFA");
                cs.endText();
                y -= hauteurLigne + 5;

                // Quantite kWh
                cs.setLineWidth(0.5f);
                cs.moveTo(20, y);
                cs.lineTo(page.getMediaBox().getWidth() - 20, y);
                cs.stroke();
                y -= 8;

                cs.setFont(fontGras, 12);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Quantite d'energie:"); cs.endText();
                cs.setFont(fontGras, 12);
                cs.beginText(); cs.newLineAtOffset(160, y);
                cs.showText(transaction.getQuantiteKwh() + " kWh");
                cs.endText();
                y -= hauteurLigne + 3;

                cs.setFont(fontNormal, 9);
                cs.beginText(); cs.newLineAtOffset(20, y);
                cs.showText("Cout unitaire: " + transaction.getCoutUnitaireKwh() + " FCFA/kWh");
                cs.endText();
                y -= hauteurLigne + 8;

                // Token
                cs.setLineWidth(0.5f);
                cs.moveTo(20, y);
                cs.lineTo(page.getMediaBox().getWidth() - 20, y);
                cs.stroke();
                y -= 8;

                cs.setFont(fontGras, 11);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Token de recharge:"); cs.endText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.COURIER_BOLD), 12);
                cs.beginText(); cs.newLineAtOffset(80, y);
                cs.showText(transaction.getTokenRecharge());
                cs.endText();
                y -= hauteurLigne + 8;

                // Monnaie
                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Montant recu:"); cs.endText();
                cs.setFont(fontNormal, 10);
                cs.beginText(); cs.newLineAtOffset(120, y);
                cs.showText(transaction.getMontantRecu() + " FCFA");
                cs.endText();
                y -= hauteurLigne;

                cs.setFont(fontGras, 10);
                cs.beginText(); cs.newLineAtOffset(20, y); cs.showText("Monnaie rendue:"); cs.endText();
                cs.setFont(fontNormal, 10);
                cs.beginText(); cs.newLineAtOffset(120, y);
                cs.showText(transaction.getMonnaieRendue() + " FCFA");
                cs.endText();
                y -= hauteurLigne + 15;

                // Pied de page
                cs.setFont(fontNormal, 8);
                cs.beginText(); cs.newLineAtOffset(20, y);
                cs.showText("Code transaction: " + transaction.getCodeTransaction());
                cs.endText();
                y -= hauteurLigne - 4;

                cs.beginText(); cs.newLineAtOffset(20, y);
                cs.showText("Caissiere: "
                        + (transaction.getUtilisateur() != null ? transaction.getUtilisateur().getNom() : "Systeme"));
                cs.endText();
                y -= 12;

                cs.setFont(fontGras, 9);
                cs.beginText(); cs.newLineAtOffset(20, y);
                cs.showText("SONABEL - L'energie au service du developpement");
                cs.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new ExceptionMetier("Erreur lors de la generation du PDF: " + e.getMessage());
        }
    }

    public void envoyerParEmail(Recu recu) {
        if (recu.getDestinataire() == null || recu.getDestinataire().isEmpty()) {
            return;
        }

        TransactionAchat transaction = recu.getTransaction();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recu.getDestinataire());
        message.setSubject("SONABEL - Recharge de " + transaction.getQuantiteKwh() + " kWh");
        message.setText(construireCorpsEmail(transaction));

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email a {}: {}", recu.getDestinataire(), e.getMessage());
        }
    }

    private String construireCorpsEmail(TransactionAchat transaction) {
        return "SONABEL - Venk-Cash\n"
                + "====================\n\n"
                + "Code transaction : " + transaction.getCodeTransaction() + "\n"
                + "Montant verse : " + transaction.getMontantVerse() + " FCFA\n"
                + "Montant net : " + transaction.getMontantNet() + " FCFA\n"
                + "Taxes appliquees : " + transaction.getMontantTaxes() + " FCFA\n"
                + "Quantite : " + transaction.getQuantiteKwh() + " kWh\n"
                + "Token de recharge : " + transaction.getTokenRecharge() + "\n\n"
                + "Merci de votre confiance.\n"
                + "SONABEL - L'energie au service du developpement.";
    }
}
