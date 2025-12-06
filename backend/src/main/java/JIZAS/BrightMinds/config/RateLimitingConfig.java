package JIZAS.BrightMinds.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class RateLimitingConfig implements WebMvcConfigurer {

    @Value("${ratelimit.login.max:1000}")
    private int loginMax;
    @Value("${ratelimit.login.window:1}")
    private int loginWindowMin;

    @Value("${ratelimit.registration.max:20}")
    private int regMax;
    @Value("${ratelimit.registration.window:60}")
    private int regWindowMin;

    @Value("${ratelimit.password-reset.max:10}")
    private int pwdResetMax;
    @Value("${ratelimit.password-reset.window:60}")
    private int pwdResetWindowMin;

    @Value("${ratelimit.general.max:1000}")
    private int generalMax;
    @Value("${ratelimit.general.window:1}")
    private int generalWindowMin;

    @Bean
    public RateLimitingInterceptor rateLimitingInterceptor() {
        return new RateLimitingInterceptor(
            loginMax, loginWindowMin,
            regMax, regWindowMin,
            pwdResetMax, pwdResetWindowMin,
            generalMax, generalWindowMin
        );
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitingInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                    "/api/seeder/**",
                    "/api/assets/**",
                    "/api/game/scene/**"
                ); 
    }

    public static class RateLimitingInterceptor implements org.springframework.web.servlet.HandlerInterceptor {
        
        private final ConcurrentHashMap<String, RateLimitInfo> rateLimitStore = new ConcurrentHashMap<>();
        
        private final int loginMax;
        private final long loginWindowMs;
        private final int regMax;
        private final long regWindowMs;
        private final int pwdResetMax;
        private final long pwdResetWindowMs;
        private final int generalMax;
        private final long generalWindowMs;

        public RateLimitingInterceptor(int loginMax, int loginWindowMin,
                                     int regMax, int regWindowMin,
                                     int pwdResetMax, int pwdResetWindowMin,
                                     int generalMax, int generalWindowMin) {
            this.loginMax = loginMax;
            this.loginWindowMs = loginWindowMin * 60 * 1000L;
            this.regMax = regMax;
            this.regWindowMs = regWindowMin * 60 * 1000L;
            this.pwdResetMax = pwdResetMax;
            this.pwdResetWindowMs = pwdResetWindowMin * 60 * 1000L;
            this.generalMax = generalMax;
            this.generalWindowMs = generalWindowMin * 60 * 1000L;
        }

        @Override
        public boolean preHandle(jakarta.servlet.http.HttpServletRequest request, 
                               jakarta.servlet.http.HttpServletResponse response, 
                               Object handler) throws Exception {
            
            String requestPath = request.getRequestURI();
            String method = request.getMethod();
            
            // Determine rate limit config based on endpoint
            RateLimitConfig config = getRateLimitConfig(requestPath, method);
            
            if (config != null) {
                // Key determination strategy:
                // 1. If User is Authenticated -> Use Username/Email
                // 2. If User is Anonymous -> Use IP Address
                
                String key;
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                boolean isAuthenticated = auth != null && auth.isAuthenticated() && 
                                        !auth.getPrincipal().equals("anonymousUser");

                if (isAuthenticated) {
                    key = auth.getName() + ":" + config.type; 
                } else {
                    key = getClientIpAddress(request) + ":" + config.type;
                }

                RateLimitInfo info = rateLimitStore.computeIfAbsent(key, k -> new RateLimitInfo());
                
                long currentTime = System.currentTimeMillis();
                
                // Clean up expired entries (simple window reset)
                // A better approach for production is Token Bucket or Sliding Window Log, 
                // but this Fixed Window Reset is sufficient for basic anti-spam.
                if (currentTime - info.windowStart > config.windowMs) {
                    info.count.set(0);
                    info.windowStart = currentTime;
                }
                
                // Check if limit exceeded
                if (info.count.get() >= config.maxRequests) {
                    response.setStatus(429); // Too Many Requests
                    response.setHeader("Retry-After", String.valueOf(config.windowMs / 1000));
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Rate limit exceeded. Please wait a moment.\"}");
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
                return new RateLimitConfig("login", loginMax, loginWindowMs);
            }
            if ("/api/users".equals(path) && "POST".equals(method)) {
                return new RateLimitConfig("registration", regMax, regWindowMs);
            }
            if (path.startsWith("/api/gamemaster/") && path.contains("/reset-password") && "POST".equals(method)) {
                return new RateLimitConfig("password_reset", pwdResetMax, pwdResetWindowMs);
            }
            // General fallback for all other API endpoints
            return new RateLimitConfig("general", generalMax, generalWindowMs);
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
