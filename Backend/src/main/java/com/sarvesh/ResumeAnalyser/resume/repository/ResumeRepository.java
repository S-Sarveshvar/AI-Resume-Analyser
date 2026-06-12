package com.sarvesh.ResumeAnalyser.resume.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sarvesh.ResumeAnalyser.resume.entity.Resume;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    
} 
