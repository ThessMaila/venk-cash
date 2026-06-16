package com.sonabel.venkcash.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FiltreAuthentificationJwt extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        final String enTeteAuth = request.getHeader("Authorization");

        if (enTeteAuth == null || !enTeteAuth.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = enTeteAuth.substring(7);
        final String nomUtilisateur = jwtService.extraireNomUtilisateur(jwt);

        if (nomUtilisateur != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtService.estValide(jwt)) {
                String profil = jwtService.extraireProfil(jwt);
                List<SimpleGrantedAuthority> autorites = List.of(new SimpleGrantedAuthority("ROLE_" + profil));
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                nomUtilisateur,
                                null,
                                autorites
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
