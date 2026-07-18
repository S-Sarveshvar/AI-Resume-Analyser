package com.sarvesh.ResumeAnalyser.jobdescription.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sarvesh.ResumeAnalyser.jobdescription.entity.JobDescription;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long>  {
    
}
