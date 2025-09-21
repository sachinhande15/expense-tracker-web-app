package com.expensetracker.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class LoggingConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(LoggingConfig.class);

    @Bean
    public RequestLoggingInterceptor requestLoggingInterceptor() {
        return new RequestLoggingInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requestLoggingInterceptor())
                .addPathPatterns("/api/**");
    }

    // Request logging interceptor
    public static class RequestLoggingInterceptor implements org.springframework.web.servlet.HandlerInterceptor {

        private static final Logger requestLogger = LoggerFactory.getLogger("REQUEST_LOGGER");

        @Override
        public boolean preHandle(jakarta.servlet.http.HttpServletRequest request,
                                jakarta.servlet.http.HttpServletResponse response,
                                Object handler) throws Exception {

            String clientIP = getClientIP(request);
            String userAgent = request.getHeader("User-Agent");

            requestLogger.info("REQUEST - Method: {}, URI: {}, ClientIP: {}, UserAgent: {}, SessionID: {}",
                request.getMethod(),
                request.getRequestURI(),
                clientIP,
                userAgent != null ? userAgent : "Unknown",
                request.getSession(false) != null ? request.getSession().getId() : "NoSession"
            );

            // Set start time for processing time calculation
            request.setAttribute("startTime", System.currentTimeMillis());

            return true;
        }

        @Override
        public void afterCompletion(jakarta.servlet.http.HttpServletRequest request,
                                   jakarta.servlet.http.HttpServletResponse response,
                                   Object handler, Exception ex) throws Exception {

            Long startTime = (Long) request.getAttribute("startTime");
            if (startTime != null) {
                requestLogger.info("RESPONSE - Method: {}, URI: {}, Status: {}, ProcessingTime: {}ms",
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus(),
                    System.currentTimeMillis() - startTime
                );
            } else {
                requestLogger.info("RESPONSE - Method: {}, URI: {}, Status: {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus()
                );
            }

            if (ex != null) {
                requestLogger.error("EXCEPTION in request processing", ex);
            }
        }

        private String getClientIP(jakarta.servlet.http.HttpServletRequest request) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }

            String xRealIP = request.getHeader("X-Real-IP");
            if (xRealIP != null && !xRealIP.isEmpty()) {
                return xRealIP;
            }

            return request.getRemoteAddr();
        }
    }
}
