package com.sonabel.venkcash.controleur;

import com.sonabel.venkcash.dto.StatistiqueDTO;
import com.sonabel.venkcash.service.StatistiqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistiques")
@RequiredArgsConstructor
public class ControleurStatistique {

    private final StatistiqueService statistiqueService;

    @GetMapping
    public ResponseEntity<StatistiqueDTO> obtenirStatistiques() {
        return ResponseEntity.ok(statistiqueService.obtenirStatistiques());
    }
}
