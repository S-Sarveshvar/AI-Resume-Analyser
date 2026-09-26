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

    public JobDescriptionService(JobDescriptionRepository jobDescriptionRepository, UserRepository userRepository) {
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.userRepository = userRepository;
    }
    public JobDescription saveJobDescription(JobDescriptionRequest jobDescriptionRequest) {
        Authentication authentication = SecurityContextHolder
                                            .getContext()
                                            .getAuthentication();
        User user = null;
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            String email = authentication.getName();
            user = userRepository.findByEmail(email).orElse(null);
        }
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        JobDescription jobDescription = new JobDescription();
        jobDescription.setTitle(jobDescriptionRequest.getTitle());
        jobDescription.setDescription(jobDescriptionRequest.getDescription());
        jobDescription.setUploadedAt(LocalDateTime.now());
        jobDescription.setUser(user);
        return jobDescriptionRepository.save(jobDescription);
    }
    public JobDescriptionResponse uploadJobDescription(JobDescriptionRequest request) {
        JobDescription jobDescription = saveJobDescription(request);
        return new JobDescriptionResponse(
                "Job Description saved successfully",
                jobDescription.getId()
        );
    }
}
