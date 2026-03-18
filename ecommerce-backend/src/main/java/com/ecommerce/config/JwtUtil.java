package com.ecommerce.config;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String SECRET = "ecommerce_secret_key_1234567890123456";

	public String generateToken(String email, String role) {
		Map<String, Object> claims = new HashMap<String, Object>();
		claims.put("role", role);
		return Jwts.builder().setClaims(claims).setSubject(email).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 86400000))
				.signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS256).compact();
	}

	public String extractEmail(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(SECRET.getBytes())
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}
	
	public String extractRole(String token) {
	    return Jwts.parserBuilder()
	            .setSigningKey(SECRET.getBytes())
	            .build()
	            .parseClaimsJws(token)
	            .getBody()
	            .get("role", String.class);
	    
	}
}
