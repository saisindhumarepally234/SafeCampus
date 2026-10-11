package com.safecampus.config;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
   http.csrf(csrf->csrf.disable()).cors(c->c.configurationSource(corsConfigurationSource()))
       .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
       .authorizeHttpRequests(a->a.requestMatchers("/api/auth/**").permitAll().anyRequest().permitAll());
   return http.build();
 }
 @Bean CorsConfigurationSource corsConfigurationSource(){
   CorsConfiguration c=new CorsConfiguration(); c.setAllowedOrigins(List.of("http://localhost:5173")); c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS")); c.setAllowedHeaders(List.of("*"));
   UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource(); s.registerCorsConfiguration("/**",c); return s;
 }
}
