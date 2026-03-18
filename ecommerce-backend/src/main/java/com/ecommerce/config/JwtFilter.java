package com.ecommerce.config;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter{
	
	@Autowired
	private JwtUtil jUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String header = request.getHeader("Authorization");
		
		if(header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);
			try {
				String email = jUtil.extractEmail(token);
				String role = jUtil.extractRole(token);
				
				List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
				
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, authorities);
				SecurityContextHolder.getContext().setAuthentication(auth);
			} catch (Exception e) {
				// TODO: handle exception
				SecurityContextHolder.clearContext();
				System.out.println("Token validation failed: " + e.getMessage());
			}
		}
		
		filterChain.doFilter(request, response);
	}
	
}
