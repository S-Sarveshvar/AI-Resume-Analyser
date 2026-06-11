package com.sarvesh.ResumeAnalyser.security;
import java.util.Date;
import java.security.Key;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

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
