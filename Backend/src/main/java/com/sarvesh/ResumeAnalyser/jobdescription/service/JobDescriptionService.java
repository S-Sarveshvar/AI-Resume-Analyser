package com.sarvesh.ResumeAnalyser.jobdescription.service;

import java.time.LocalDateTime;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.sarvesh.ResumeAnalyser.auth.entity.User;
import com.sarvesh.ResumeAnalyser.auth.repository.UserRepository;
import com.sarvesh.ResumeAnalyser.jobdescription.dto.JobDescriptionRequest;
import com.sarvesh.ResumeAnalyser.jobdescription.dto.JobDescriptionResponse;
import com.sarvesh.ResumeAnalyser.jobdescription.entity.JobDescription;
import com.sarvesh.ResumeAnalyser.jobdescription.repository.JobDescriptionRepository;

@Service
public class JobDescriptionService {
    private final JobDescriptionRepository jobDescriptionRepository;
    private final UserRepository userRepository;
    JobDescription jobDescription = new JobDescription();
    public JobDescriptionService(JobDescriptionRepository jobDescriptionRepository, UserRepository userRepository) {
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.userRepository = userRepository;
    }
    public JobDescriptionResponse uploadJobDescription(JobDescriptionRequest jobDescriptionRequest) {
        Authentication authentication = SecurityContextHolder
                                            .getContext()
                                            .getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        jobDescription.setTitle(jobDescriptionRequest.getTitle());
        jobDescription.setDescription(jobDescriptionRequest.getDescription());
        jobDescription.setUploadedAt(LocalDateTime.now());
        jobDescription.setUser(user);
        jobDescriptionRepository.save(jobDescription);
        return new JobDescriptionResponse("Job Description saved successfully", jobDescription.getId());
    }
}
