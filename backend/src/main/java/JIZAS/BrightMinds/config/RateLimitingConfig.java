package JIZAS.BrightMinds.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class RateLimitingConfig implements WebMvcConfigurer {

    @Bean
    public RateLimitingInterceptor rateLimitingInterceptor() {
        return new RateLimitingInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitingInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/seeder/**"); // Exclude seeder from rate limiting
    }

    public static class RateLimitingInterceptor implements org.springframework.web.servlet.HandlerInterceptor {
        
        // In-memory rate limiting store (for production, consider Redis)
        private final ConcurrentHashMap<String, RateLimitInfo> rateLimitStore = new ConcurrentHashMap<>();
        
        // Rate limits
        private static final int LOGIN_ATTEMPTS = 5;
        private static final int LOGIN_WINDOW_MINUTES = 15;
        private static final int REGISTRATION_ATTEMPTS = 3;
        private static final int REGISTRATION_WINDOW_MINUTES = 60;
        private static final int PASSWORD_RESET_ATTEMPTS = 3;
        private static final int PASSWORD_RESET_WINDOW_MINUTES = 60;
        private static final int GENERAL_REQUESTS = 100;
        private static final int GENERAL_WINDOW_MINUTES = 1;

        @Override
        public boolean preHandle(jakarta.servlet.http.HttpServletRequest request, 
                               jakarta.servlet.http.HttpServletResponse response, 
                               Object handler) throws Exception {
            
            String clientIp = getClientIpAddress(request);
            String requestPath = request.getRequestURI();
            String method = request.getMethod();
            
            // Determine rate limit based on endpoint
            RateLimitConfig config = getRateLimitConfig(requestPath, method);
            
            if (config != null) {
                String key = clientIp + ":" + config.type;
                RateLimitInfo info = rateLimitStore.computeIfAbsent(key, k -> new RateLimitInfo());
                
                long currentTime = System.currentTimeMillis();
                
                // Clean up expired entries
                if (currentTime - info.windowStart > config.windowMs) {
                    info.count.set(0);
                    info.windowStart = currentTime;
                }
                
                // Check if limit exceeded
                if (info.count.get() >= config.maxRequests) {
                    response.setStatus(429); // Too Many Requests
                    response.setHeader("Retry-After", String.valueOf(config.windowMs / 1000));
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Rate limit exceeded. Please try again later.\"}");
                    return false;
                }
                
                // Increment counter
                info.count.incrementAndGet();
            }
            
            return true;
        }
        
        private String getClientIpAddress(jakarta.servlet.http.HttpServletRequest request) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        }
        
        private RateLimitConfig getRateLimitConfig(String path, String method) {
            if ("/api/auth/login".equals(path) && "POST".equals(method)) {
                return new RateLimitConfig("login", LOGIN_ATTEMPTS, LOGIN_WINDOW_MINUTES * 60 * 1000);
            }
            if ("/api/users".equals(path) && "POST".equals(method)) {
                return new RateLimitConfig("registration", REGISTRATION_ATTEMPTS, REGISTRATION_WINDOW_MINUTES * 60 * 1000);
            }
            if (path.startsWith("/api/gamemaster/") && path.contains("/reset-password") && "POST".equals(method)) {
                return new RateLimitConfig("password_reset", PASSWORD_RESET_ATTEMPTS, PASSWORD_RESET_WINDOW_MINUTES * 60 * 1000);
            }
            if (path.startsWith("/api/") && !path.startsWith("/api/auth/login") && !path.startsWith("/api/users") && !path.startsWith("/api/seeder")) {
                return new RateLimitConfig("general", GENERAL_REQUESTS, GENERAL_WINDOW_MINUTES * 60 * 1000);
            }
            return null;
        }
        
        private static class RateLimitInfo {
            AtomicInteger count = new AtomicInteger(0);
            long windowStart = System.currentTimeMillis();
        }
        
        private static class RateLimitConfig {
            final String type;
            final int maxRequests;
            final long windowMs;
            
            RateLimitConfig(String type, int maxRequests, long windowMs) {
                this.type = type;
                this.maxRequests = maxRequests;
                this.windowMs = windowMs;
            }
        }
    }
}
