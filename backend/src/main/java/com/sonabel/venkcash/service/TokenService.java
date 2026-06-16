package com.sonabel.venkcash.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.text.DecimalFormat;

@Service
public class TokenService {

    private static final SecureRandom random = new SecureRandom();

    public String genererTokenRecharge() {
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < 20; i++) {
            token.append(random.nextInt(10));
        }
        return token.toString();
    }

    public String genererTokenAnnulation() {
        StringBuilder token = new StringBuilder("ANN-");
        for (int i = 0; i < 16; i++) {
            token.append(random.nextInt(10));
        }
        return token.toString();
    }

    public String genererCodeTransaction() {
        DecimalFormat df = new DecimalFormat("000000");
        long timestamp = System.currentTimeMillis() % 1000000;
        return "VENK-" + df.format(timestamp) + "-" + (random.nextInt(900) + 100);
    }

    public String genererNumeroRecu() {
        DecimalFormat df = new DecimalFormat("000000");
        long timestamp = System.currentTimeMillis() % 1000000;
        return "REC-" + df.format(timestamp);
    }
}
