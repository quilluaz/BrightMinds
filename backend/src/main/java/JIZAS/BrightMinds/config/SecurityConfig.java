package JIZAS.BrightMinds.config;

import JIZAS.BrightMinds.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enable method-level security
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        CookieCsrfTokenRepository csrfRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        csrfRepository.setCookiePath("/");
        csrfRepository.setCookieCustomizer(c -> c.secure(true).sameSite("Lax"));

        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null); // Use default _csrf

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfRepository)
                        .csrfTokenRequestHandler(requestHandler)
                        .ignoringRequestMatchers("/api/auth/login", "/api/users", "/api/seeder/**") // Allow seeder without CSRF
                )
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // TODO: Re-enable role-based security when JWT is fully implemented
                        // .requestMatchers("/api/gamemaster/**").hasRole("GAMEMASTER")
                        .requestMatchers("/api/gamemaster/**").permitAll() // Temporary for testing
                        .requestMatchers("/api/seeder/**").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/refresh").permitAll() // Refresh endpoint needs to be accessible
                        .requestMatchers("/api/users").permitAll() // Allow user creation without auth
                        .requestMatchers("/api/users/**").permitAll()
                        .requestMatchers("/api/progress/**").permitAll()
                        .requestMatchers("/api/questions/**").permitAll()
                        .requestMatchers("/api/choices/**").permitAll()
                        .requestMatchers("/api/answers/**").permitAll()
                        .requestMatchers("/api/stories/**").permitAll()
                        .requestMatchers("/api/scenes/**").permitAll()
                        .requestMatchers("/api/scene-assets/**").permitAll()
                        .requestMatchers("/api/assets/**").permitAll()
                        .requestMatchers("/api/user-responses/**").permitAll()
                        .requestMatchers("/api/game/**").permitAll()
                        .requestMatchers("/api/user-badges/**").permitAll()
                        .requestMatchers("/api/badges/**").permitAll()
                        .requestMatchers("/api/dialogues/**").permitAll()
                        .requestMatchers("/api/game-attempts/**").permitAll()
                        .requestMatchers("/api/story-scores/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                );
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Get allowed origins from environment variable, fallback to defaults
        String allowedOrigins = System.getenv().getOrDefault("ALLOWED_ORIGINS", 
            "http://localhost:5173,https://brightminds-cit.vercel.app");
        configuration.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split(",")));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-XSRF-TOKEN")); // Expose X-XSRF-TOKEN
        configuration.setExposedHeaders(Arrays.asList("X-XSRF-TOKEN")); // Expose the CSRF token header
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

