package com.example.shelfshare.service;

import java.security.KeyPair;
import java.security.PublicKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.shelfshare.entity.Users;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureAlgorithm;
import io.jsonwebtoken.security.SignatureException;

@Service
public class JWTService {
    private static final SignatureAlgorithm alg = Jwts.SIG.RS512;
    private KeyPair pair;
    private static final Integer ACCESS_EXPIRY_SECONDS = 30;
    private static final Integer REFERSH_EXPIRY_SECONDS = 15 * 60 * 60;

    public JWTService() {
        this.pair = alg.keyPair().build();
    }

    public PublicKey getPublicKey() {
        return pair.getPublic();
    }

    public String createAccessToken(Users user) {
        return Jwts.builder()
                    .signWith(pair.getPrivate(), alg)
                    .subject(String.valueOf(user.getUserId()))
                    .claims(Map.of("name", user.getUsername(), "isAdmin", user.isAdmin()))
                    .expiration(Date.from(Instant.now().plusSeconds(ACCESS_EXPIRY_SECONDS)))
                    .compact();
    }

    public String createNewAccessToken(String refreshToken) throws SignatureException {
        var parsedRefreshToken = Jwts.parser()
                                        .verifyWith(getPublicKey())
                                        .build()
                                        .parseSignedClaims(refreshToken);
        return Jwts.builder()
                    .signWith(pair.getPrivate(), alg)
                    .subject(parsedRefreshToken.getPayload().getSubject())
                    .claims(parsedRefreshToken.getPayload())
                    .expiration(Date.from(Instant.now().plusSeconds(ACCESS_EXPIRY_SECONDS)))
                    .compact();
    }

    public String createRefreshToken(Users user) {
        return Jwts.builder()
                    .signWith(pair.getPrivate(), alg)
                    .subject(String.valueOf(user.getUserId()))
                    .claims(Map.of("name", user.getUsername(), "isAdmin", user.isAdmin()))
                    .expiration(Date.from(Instant.now().plusSeconds(REFERSH_EXPIRY_SECONDS)))
                    .compact();
    }
    
}
