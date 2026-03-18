package com.ecommerce.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
	
	@Autowired
	private JwtFilter jFilter;
	
	@Bean
	public BCryptPasswordEncoder passwordEncode() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {

	    CorsConfiguration config = new CorsConfiguration();

	    config.setAllowedOrigins(List.of("http://localhost:5173"));
	    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
	    config.setAllowedHeaders(List.of("*"));
	    config.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);

	    return source;
	}
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(corsConfigurationSource())) 
	        .authorizeHttpRequests(auth -> auth
	            // 1. Public Endpoints (Anyone can access)
	            .requestMatchers("/api/auth/**").permitAll()
	             
	            // 2. Allow Viewing Products/Categories/Images without login (GET only)
	            .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
	            .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
	            .requestMatchers(HttpMethod.GET, "/api/images/**").permitAll() // If using local images

	            // 3. Admin Only Endpoints (Adding/Deleting requires 'ADMIN' role)
	            .requestMatchers(HttpMethod.POST, "/api/products/**").hasAuthority("ADMIN")
	            .requestMatchers(HttpMethod.POST, "/api/categories/**").hasAuthority("ADMIN")
	            .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAuthority("ADMIN")
	            .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAuthority("ADMIN")
	            
	            // 4. Everything else (Cart, Checkout) requires login
	            .anyRequest().authenticated()
	        );
		
		http.addFilterBefore(jFilter, UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
		
	}
}
