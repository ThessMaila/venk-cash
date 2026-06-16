package com.sonabel.venkcash.service;

import com.sonabel.venkcash.dto.ConnexionReponse;
import com.sonabel.venkcash.dto.ConnexionRequete;
import com.sonabel.venkcash.entite.Utilisateur;
import com.sonabel.venkcash.exception.ExceptionMetier;
import com.sonabel.venkcash.repository.UtilisateurRepository;
import com.sonabel.venkcash.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder encodeurMotDePasse;
    private final JwtService jwtService;

    public ConnexionReponse connecter(ConnexionRequete requete) {
        Utilisateur utilisateur = utilisateurRepository.findByNomUtilisateur(requete.getNomUtilisateur())
                .orElseThrow(() -> new ExceptionMetier("Nom d'utilisateur ou mot de passe incorrect"));

        if (!encodeurMotDePasse.matches(requete.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new ExceptionMetier("Nom d'utilisateur ou mot de passe incorrect");
        }

        if (!utilisateur.getActif()) {
            throw new ExceptionMetier("Ce compte est desactive. Veuillez contacter l'administrateur.");
        }

        utilisateur.setDerniereConnexion(LocalDateTime.now());
        utilisateurRepository.save(utilisateur);

        String token = jwtService.genererToken(
                utilisateur.getNomUtilisateur(),
                utilisateur.getProfil().name()
        );

        return ConnexionReponse.builder()
                .token(token)
                .type("Bearer")
                .id(utilisateur.getId())
                .nomUtilisateur(utilisateur.getNomUtilisateur())
                .email(utilisateur.getEmail())
                .profil(utilisateur.getProfil().name())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .build();
    }

    public Utilisateur creer(Utilisateur utilisateur) {
        if (utilisateurRepository.existsByNomUtilisateur(utilisateur.getNomUtilisateur())) {
            throw new ExceptionMetier("Ce nom d'utilisateur existe deja");
        }
        utilisateur.setMotDePasse(encodeurMotDePasse.encode(utilisateur.getMotDePasse()));
        return utilisateurRepository.save(utilisateur);
    }

    public List<Utilisateur> listerTous() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur trouverParId(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new ExceptionMetier("Utilisateur non trouve"));
    }

    public void supprimer(Long id) {
        Utilisateur utilisateur = trouverParId(id);
        utilisateur.setActif(false);
        utilisateurRepository.save(utilisateur);
    }
}
