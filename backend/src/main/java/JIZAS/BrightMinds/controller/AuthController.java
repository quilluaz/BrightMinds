package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.LoginRequestDTO;
import JIZAS.BrightMinds.dto.UserViewDTO;
import JIZAS.BrightMinds.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import JIZAS.BrightMinds.security.JwtService;
import JIZAS.BrightMinds.service.RefreshTokenService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "APIs for user authentication in the BrightMinds system")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user with email and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<UserViewDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserViewDTO userViewDTO = userService.getByEmail(loginRequest.getEmail());
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        String accessToken = jwtService.generateToken(userDetails);
        userViewDTO.setToken(accessToken);

        String ip = request.getRemoteAddr();
        String ua = request.getHeader("User-Agent");
        RefreshTokenService.IssuedToken rt = refreshTokenService.issueNewFamily(userViewDTO.getUserId(), ip, ua);

        ResponseCookie cookie = ResponseCookie.from("rt", rt.cookieValue)
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        // Echo CSRF token header if present (CookieCsrfTokenRepository sends token as cookie XSRF-TOKEN)
        String csrfFromCookie = null;
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie c : request.getCookies()) {
                if ("XSRF-TOKEN".equals(c.getName())) { csrfFromCookie = c.getValue(); break; }
            }
        }
        if (csrfFromCookie != null) {
            response.addHeader("X-XSRF-TOKEN", csrfFromCookie);
        }

        return ResponseEntity.ok().body(userViewDTO);
    }

    @GetMapping("/me")
    public ResponseEntity<UserViewDTO> me(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        UserViewDTO dto = userService.getByEmail(principal.getUsername());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String cookie = null;
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie c : request.getCookies()) {
                if ("rt".equals(c.getName())) { cookie = c.getValue(); break; }
            }
        }
        if (cookie == null || !cookie.contains(".")) {
            return ResponseEntity.status(401).body("Missing refresh token");
        }
        try {
            RefreshTokenService.RotationResult result = refreshTokenService.rotateByCookie(cookie, request.getRemoteAddr(), request.getHeader("User-Agent"));
            UserViewDTO user = userService.get(result.userId);
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String accessToken = jwtService.generateToken(userDetails);

            ResponseCookie newCookie = ResponseCookie.from("rt", result.issued.cookieValue)
                    .httpOnly(true)
                    .secure(true)
                    .path("/api/auth/refresh")
                    .sameSite("Lax")
                    .build();
            response.addHeader("Set-Cookie", newCookie.toString());
            // Echo CSRF token if available
            String csrfFromCookie = null;
            if (request.getCookies() != null) {
                for (jakarta.servlet.http.Cookie c : request.getCookies()) {
                    if ("XSRF-TOKEN".equals(c.getName())) { csrfFromCookie = c.getValue(); break; }
                }
            }
            if (csrfFromCookie != null) {
                response.addHeader("X-XSRF-TOKEN", csrfFromCookie);
            }

            return ResponseEntity.ok(Map.of("token", accessToken));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(401).body("Invalid or reused refresh token");
        }
    }
}
