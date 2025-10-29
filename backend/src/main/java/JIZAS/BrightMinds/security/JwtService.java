package JIZAS.BrightMinds.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${security.jwt.private:}")
    private String base64Private;

    @Value("${security.jwt.public:}")
    private String base64Public;

    @Value("${security.jwt.secret:}")
    private String hmacSecret;

    @Value("${security.jwt.expiration-ms:600000}")
    private long jwtExpirationMs;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(Map.of(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);
        String jti = UUID.randomUUID().toString();
        String roles = String.join(",", userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());

        JwtBuilder builder = Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .claim("jti", jti)
                .claim("roles", roles);

        if (useRsa()) {
            return builder.signWith(getPrivateKey(), io.jsonwebtoken.SignatureAlgorithm.RS256).compact();
        } else {
            return builder.signWith(getHmacKey(), io.jsonwebtoken.SignatureAlgorithm.HS256).compact();
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        if (useRsa()) {
            return Jwts.parserBuilder()
                    .setSigningKey(getPublicKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } else {
            return Jwts.parserBuilder()
                    .setSigningKey(getHmacKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }
    }

    private PrivateKey getPrivateKey() {
        byte[] keyBytes = Decoders.BASE64.decode(base64Private);
        try {
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(spec);
        } catch (Exception e) {
            throw new IllegalStateException("Invalid RSA private key", e);
        }
    }

    private PublicKey getPublicKey() {
        byte[] keyBytes = Decoders.BASE64.decode(base64Public);
        try {
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePublic(spec);
        } catch (Exception e) {
            throw new IllegalStateException("Invalid RSA public key", e);
        }
    }

    private Key getHmacKey() {
        byte[] keyBytes = Decoders.BASE64.decode(hmacSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private boolean useRsa() {
        return base64Private != null && !base64Private.isBlank() && base64Public != null && !base64Public.isBlank();
    }
}


