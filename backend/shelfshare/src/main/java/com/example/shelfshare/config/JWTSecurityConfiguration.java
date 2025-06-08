package com.example.shelfshare.config;

import java.security.interfaces.RSAPublicKey;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.shelfshare.service.JWTService;

@Configuration
@EnableWebSecurity
public class JWTSecurityConfiguration {

    @Autowired
    private JWTService jwtService;

    @Bean
    @Order(0)
    public SecurityFilterChain filterChainIgnoreAuth(HttpSecurity http) throws Exception {
        http.securityMatcher("/login/**").authorizeHttpRequests((authorize) -> authorize
                                    .requestMatchers("/login/**").permitAll())
                                    .cors(Customizer.withDefaults())
                                    .csrf((csrf) -> csrf.disable());
        return http.build();
    }

    @Bean
    @Order(1)
    public SecurityFilterChain filterChainRegister(HttpSecurity http) throws Exception {
        http.securityMatcher("/register/**").authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/register/**").permitAll())
                .cors(Customizer.withDefaults())
                .csrf((csrf) -> csrf.disable());
        return http.build();
    }

    @Bean
  @Order(2)
  public SecurityFilterChain filterChainTokenRefresh(HttpSecurity http) throws Exception {
    http.securityMatcher("/token/**")
        .authorizeHttpRequests((authorize) -> authorize
            .requestMatchers("/token/refresh").permitAll()
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt
                .decoder(myJwtDecoder())
                .jwtAuthenticationConverter(myJwtAuthenticationConverter())))
        .cors(Customizer.withDefaults())
        .csrf((csrf) -> csrf.disable());

    return http.build();
  }

    @Bean
    @Order(3)
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/books/enlist/**").authenticated()
                        .requestMatchers("/books/add").authenticated()
                        .requestMatchers("/user/**").authenticated()
                        .requestMatchers("/books/my-books").authenticated()
                        .requestMatchers("/books/**").permitAll()
                        .requestMatchers("/anonymous-books/**").permitAll()
                        .requestMatchers("/filterBooks/**").permitAll()

                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(myJwtDecoder())
                                .jwtAuthenticationConverter(myJwtAuthenticationConverter())))
                .cors(Customizer.withDefaults())
                .csrf((csrf) -> csrf.disable());
        return http.build();
    }
    
    @Bean
    public UrlBasedCorsConfigurationSource myCorsConfig() {
        var config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedOrigin("http://127.0.0.1:4200");
        config.setAllowedMethods(List.of("GET", "PUT", "POST", "OPTIONS", "DELETE", "PATCH"));
        config.addExposedHeader("Token-Status");
        var src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", config);
        return src;
    }

    private JwtDecoder myJwtDecoder() {
        if (!(jwtService.getPublicKey() instanceof RSAPublicKey)) {
            return null;
        } else {
            var asRSAKey = (RSAPublicKey) jwtService.getPublicKey();
            System.out.println(asRSAKey);
            return NimbusJwtDecoder.withPublicKey(asRSAKey).signatureAlgorithm(SignatureAlgorithm.RS512).build();
        }
    }

    private JwtAuthenticationConverter myJwtAuthenticationConverter() {
        var jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
            var role = jwt.getClaimAsBoolean("isAdmin") ? "ROLE_ADMIN" : "ROLE_USER";
            grantedAuthorities.add(new SimpleGrantedAuthority(role));
            return grantedAuthorities;
        });
        return jwtAuthenticationConverter;
    }
}
