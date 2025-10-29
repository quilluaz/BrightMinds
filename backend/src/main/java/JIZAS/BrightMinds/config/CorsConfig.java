package JIZAS.BrightMinds.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "https://brightminds-cit.vercel.app",
                "http://localhost:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "X-GameMaster-Id"
        ));
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Location",
                "Content-Disposition",
                "Retry-After"
        ));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        // Allow swagger docs too (useful during testing)
        source.registerCorsConfiguration("/swagger-ui/**", configuration);
        source.registerCorsConfiguration("/api-docs/**", configuration);
        return source;
    }
}

package JIZAS.BrightMinds.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Get allowed origins from environment variable, fallback to defaults
        String allowedOrigins = System.getenv().getOrDefault("ALLOWED_ORIGINS", 
            "http://localhost:5173,https://brightminds-cit.vercel.app");
        
        // Debug logging
        System.out.println("CORS Filter - ALLOWED_ORIGINS from env: " + System.getenv("ALLOWED_ORIGINS"));
        System.out.println("CORS Filter - Using allowedOrigins: " + allowedOrigins);
        
        // Configure CORS
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-XSRF-TOKEN", "X-GameMaster-Id"));
        configuration.setExposedHeaders(Arrays.asList("X-XSRF-TOKEN"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour

        // Debug logging for CORS configuration
        System.out.println("CORS Filter - Allowed Origins: " + configuration.getAllowedOrigins());
        System.out.println("CORS Filter - Allowed Methods: " + configuration.getAllowedMethods());
        System.out.println("CORS Filter - Allowed Headers: " + configuration.getAllowedHeaders());
        System.out.println("CORS Filter - Allow Credentials: " + configuration.getAllowCredentials());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return new CorsFilter(source);
    }
}
