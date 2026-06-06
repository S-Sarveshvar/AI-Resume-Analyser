package com.sarvesh.ResumeAnalyser.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.sarvesh.ResumeAnalyser.auth.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
