package com.sarvesh.ResumeAnalyser.jobdescription.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sarvesh.ResumeAnalyser.jobdescription.dto.JobDescriptionRequest;
import com.sarvesh.ResumeAnalyser.jobdescription.dto.JobDescriptionResponse;
import com.sarvesh.ResumeAnalyser.jobdescription.service.JobDescriptionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api")
public class JobDescriptionController {
    JobDescriptionService jobDescriptionService;
    public JobDescriptionController(JobDescriptionService jobDescriptionService) {
        this.jobDescriptionService = jobDescriptionService;
    }
    @PostMapping("/job-descriptions")
    public ResponseEntity<JobDescriptionResponse> saveJobDescription(@RequestBody JobDescriptionRequest jobDescriptionRequest) {
        return ResponseEntity.ok(jobDescriptionService.uploadJobDescription(jobDescriptionRequest));
    }
    
}
