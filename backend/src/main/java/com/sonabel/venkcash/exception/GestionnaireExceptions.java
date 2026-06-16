package com.sonabel.venkcash.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GestionnaireExceptions {

    @ExceptionHandler(ExceptionMetier.class)
    public ResponseEntity<Map<String, Object>> handleExceptionMetier(ExceptionMetier ex) {
        return construireReponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erreurs = new HashMap<>();
        for (FieldError erreur : ex.getBindingResult().getFieldErrors()) {
            erreurs.put(erreur.getField(), erreur.getDefaultMessage());
        }
        Map<String, Object> corps = new HashMap<>();
        corps.put("timestamp", LocalDateTime.now());
        corps.put("statut", HttpStatus.BAD_REQUEST.value());
        corps.put("message", "Erreur de validation");
        corps.put("erreurs", erreurs);
        return ResponseEntity.badRequest().body(corps);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return construireReponse(HttpStatus.FORBIDDEN, "Acces refuse");
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        return construireReponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobal(Exception ex) {
        return construireReponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne du serveur");
    }

    private ResponseEntity<Map<String, Object>> construireReponse(HttpStatus statut, String message) {
        Map<String, Object> corps = new HashMap<>();
        corps.put("timestamp", LocalDateTime.now());
        corps.put("statut", statut.value());
        corps.put("message", message);
        return new ResponseEntity<>(corps, statut);
    }
}
