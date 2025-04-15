package com.enote.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*") // 添加跨域支持
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<?> publicEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a public endpoint - anyone can access it");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/protected")
    public ResponseEntity<?> protectedEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a protected endpoint - only authenticated users can access it");
        response.put("username", authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth-debug")
    public ResponseEntity<?> authDebugEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("principal", authentication.getPrincipal());
        response.put("name", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("authenticated", authentication.isAuthenticated());
        response.put("details", authentication.getDetails());
        return ResponseEntity.ok(response);
    }
}