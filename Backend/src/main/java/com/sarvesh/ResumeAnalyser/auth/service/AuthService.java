package com.sarvesh.ResumeAnalyser.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sarvesh.ResumeAnalyser.auth.dto.AuthResponse;
import com.sarvesh.ResumeAnalyser.auth.dto.LoginRequest;
import com.sarvesh.ResumeAnalyser.auth.dto.RegisterRequest;
import com.sarvesh.ResumeAnalyser.auth.entity.User;
import com.sarvesh.ResumeAnalyser.auth.repository.UserRepository;
import com.sarvesh.ResumeAnalyser.security.JwtService;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(
                registerRequest.getPassword()
        ));
        userRepository.save(user);
        return new AuthResponse("Registration Successful", null);
    }
    public AuthResponse login(LoginRequest request) {
        User user = userRepository
        .findByEmail(request.getEmail())
        .orElseThrow(() ->
                new RuntimeException("User not found"));
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Credentials");
        }
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse("Login Successful", token);
    }
}
