package com.sonabel.venkcash.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long expiration;

    public String genererToken(String nomUtilisateur, String profil) {
        Map<String, Object> revendications = new HashMap<>();
        revendications.put("profil", profil);
        return Jwts.builder()
                .claims(revendications)
                .subject(nomUtilisateur)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getCleSignature())
                .compact();
    }

    public String extraireNomUtilisateur(String token) {
        return extraireToutesRevendications(token).getSubject();
    }

    public String extraireProfil(String token) {
        return extraireToutesRevendications(token).get("profil", String.class);
    }

    public boolean estValide(String token) {
        try {
            extraireToutesRevendications(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims extraireToutesRevendications(String token) {
        return Jwts.parser()
                .verifyWith(getCleSignature())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getCleSignature() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }
}
