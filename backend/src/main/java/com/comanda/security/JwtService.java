package com.comanda.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtTokenProvider tokenProvider;

    public String generateToken(UserDetails userDetails) {
        return tokenProvider.generateToken(userDetails);
    }

    public String getUsernameFromToken(String token) {
        return tokenProvider.getUsernameFromToken(token);
    }

    public boolean validateToken(String token) {
        return tokenProvider.validateToken(token);
    }
}
