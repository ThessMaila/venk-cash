package com.sonabel.venkcash.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class ConfigurationSecurite {

    private final FiltreAuthentificationJwt filtreAuthentificationJwt;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/statistiques/**").authenticated()
                .requestMatchers("/api/grille-tarifaire/**").hasAnyRole("ADMINISTRATEUR", "CHEF_GUICHET")
                .requestMatchers("/api/tarifs/**").hasAnyRole("ADMINISTRATEUR", "CHEF_GUICHET")
                .requestMatchers("/api/utilisateurs/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("/api/branchements/**").hasAnyRole("ADMINISTRATEUR", "CHEF_GUICHET")
                .requestMatchers("/api/abonnements/**").hasAnyRole("ADMINISTRATEUR", "CHEF_GUICHET", "CAISSIERE")
                .requestMatchers("/api/abonnes/**").hasAnyRole("ADMINISTRATEUR", "CHEF_GUICHET", "CAISSIERE")
                .requestMatchers("/api/compteurs/**").hasAnyRole("ADMINISTRATEUR", "CHEF_GUICHET")
                .requestMatchers("/api/transactions/**").hasAnyRole("ADMINISTRATEUR", "CHEF_GUICHET", "CAISSIERE")
                .requestMatchers("/api/sessions-caisse/**").hasAnyRole("ADMINISTRATEUR", "CHEF_GUICHET", "CAISSIERE")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(filtreAuthentificationJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder encodeurMotDePasse() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
