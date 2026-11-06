package com.healthplus.gateway.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

@Configuration
public class KeyResolverConfiguration {

    private static final Logger log = LoggerFactory.getLogger(KeyResolverConfiguration.class);
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String DEFAULT_FALLBACK_KEY = "anonymous-client";
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Resuelve de forma reactiva la clave única para el algoritmo Token Bucket.
     * Prioridad:
     * 1. Reclamo de usuario (sub / user_id) en el token JWT.
     * 2. Dirección IP del cliente remoto o cabecera X-Forwarded-For.
     */
    @Bean
    @Primary
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.defer(() -> {
            ServerHttpRequest request = exchange.getRequest();
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
                String token = authHeader.substring(BEARER_PREFIX.length()).trim();
                String userId = extractSubjectFromJwt(token);
                if (userId != null && !userId.isBlank()) {
                    log.debug("Rate Limiting aplicado al usuario autenticado: {}", userId);
                    return Mono.just("user:" + userId);
                }
            }

            // Fallback reactivo: resolución de IP remota del cliente
            String clientIp = Optional.ofNullable(request.getRemoteAddress())
                    .map(InetSocketAddress::getAddress)
                    .map(java.net.InetAddress::getHostAddress)
                    .orElseGet(() -> Optional.ofNullable(request.getHeaders().getFirst("X-Forwarded-For"))
                            .map(xff -> xff.split(",")[0].trim())
                            .orElse(DEFAULT_FALLBACK_KEY));

            log.debug("Rate Limiting aplicado por IP de cliente: {}", clientIp);
            return Mono.just("ip:" + clientIp);
        });
    }

    /**
     * Decodificación no bloqueante y eficiente del payload JWT sin overhead criptográfico.
     */
    private String extractSubjectFromJwt(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                byte[] decodedBytes = Base64.getUrlDecoder().decode(parts[1]);
                String payload = new String(decodedBytes, StandardCharsets.UTF_8);
                JsonNode jsonNode = objectMapper.readTree(payload);
                if (jsonNode.has("sub")) {
                    return jsonNode.get("sub").asText();
                } else if (jsonNode.has("user_id")) {
                    return jsonNode.get("user_id").asText();
                }
            }
        } catch (Exception ex) {
            log.warn("Fallo al parsear payload del JWT para rate limiting: {}", ex.getMessage());
        }
        return null;
    }
}
