package com.sarvesh.ResumeAnalyser.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sarvesh.ResumeAnalyser.auth.dto.AuthResponse;
import com.sarvesh.ResumeAnalyser.auth.dto.LoginRequest;
import com.sarvesh.ResumeAnalyser.auth.dto.RegisterRequest;
import com.sarvesh.ResumeAnalyser.auth.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(
            authService.register(registerRequest)
        );
    } 
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(
            authService.login(loginRequest)
        );
    } 
}
