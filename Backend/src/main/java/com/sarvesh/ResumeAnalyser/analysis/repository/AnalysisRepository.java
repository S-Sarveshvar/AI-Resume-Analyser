package com.sarvesh.ResumeAnalyser.analysis.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sarvesh.ResumeAnalyser.analysis.entity.Analysis;

public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    
}
