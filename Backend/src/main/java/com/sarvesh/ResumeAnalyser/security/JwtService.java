package com.sarvesh.ResumeAnalyser.security;
import java.util.Date;

import javax.crypto.SecretKey;

import java.security.Key;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;
    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
    public boolean isTokenExpired(String token) {
        Date expirationDate = Jwts.parser()
                                .verifyWith((SecretKey) getSigningKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload()
                                .getExpiration();
        return expirationDate.before(new Date());
    }
    public boolean isTokenValid(String token, String email) {
        return extractEmail(token).equals(email) && !isTokenExpired(token);
    }
    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email) {
        return Jwts.builder()
                            .subject(email)
                            .issuedAt(new Date())
                            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                            .signWith(getSigningKey())
                            .compact();
    }
}
