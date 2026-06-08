package com.sarvesh.ResumeAnalyser.auth.service;

import org.springframework.stereotype.Service;

import com.sarvesh.ResumeAnalyser.auth.dto.AuthResponse;
import com.sarvesh.ResumeAnalyser.auth.dto.LoginRequest;
import com.sarvesh.ResumeAnalyser.auth.dto.RegisterRequest;
import com.sarvesh.ResumeAnalyser.auth.entity.User;
import com.sarvesh.ResumeAnalyser.auth.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public AuthResponse register(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        userRepository.save(user);
        return new AuthResponse("Registration Successful");
    }
    public AuthResponse login(LoginRequest request) {
        User user = userRepository
        .findByEmail(request.getEmail())
        .orElseThrow(() ->
                new RuntimeException("User not found"));
        if(!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid Credentials");
        }
        return new AuthResponse("Login Successful");
    }
}
