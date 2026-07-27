package com.sarvesh.ResumeAnalyser.analysis.service;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sarvesh.ResumeAnalyser.analysis.dto.AnalysisRequest;
import com.sarvesh.ResumeAnalyser.analysis.dto.AnalysisResponse;
import com.sarvesh.ResumeAnalyser.analysis.entity.Analysis;
import com.sarvesh.ResumeAnalyser.analysis.repository.AnalysisRepository;
import com.sarvesh.ResumeAnalyser.exception.GeminiException;
import com.sarvesh.ResumeAnalyser.jobdescription.dto.JobDescriptionRequest;
import com.sarvesh.ResumeAnalyser.jobdescription.entity.JobDescription;
import com.sarvesh.ResumeAnalyser.jobdescription.service.JobDescriptionService;
import com.sarvesh.ResumeAnalyser.resume.entity.Resume;
import com.sarvesh.ResumeAnalyser.resume.service.ResumeService;

@Transactional
@Service
public class AnalysisService {
    private final ResumeService resumeService;
    private final JobDescriptionService jobDescriptionService;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;
    private final AnalysisRepository analysisRepository;
    public AnalysisService(ResumeService resumeService, JobDescriptionService jobDescriptionService, GeminiService geminiService, AnalysisRepository analysisRepository, ObjectMapper objectMapper) {
        this.resumeService = resumeService;
        this.jobDescriptionService = jobDescriptionService;
        this.geminiService = geminiService;
        this.analysisRepository = analysisRepository;
        this.objectMapper = objectMapper;
    }
    public AnalysisResponse analyzeResume(AnalysisRequest analysisRequest) throws IOException {
        Resume resume = resumeService.saveResume(analysisRequest.getResume());
        JobDescription jobDescription = jobDescriptionService.saveJobDescription(new JobDescriptionRequest(analysisRequest.getTitle(), analysisRequest.getDescription()));
        String prompt = buildPrompt(resume, jobDescription);
        String jsonResponse = geminiService.generateContent(prompt);
        AnalysisResponse response;
        try {
            response = objectMapper.readValue(jsonResponse, AnalysisResponse.class);
        }
        catch(JsonProcessingException e) {
            throw new GeminiException("Gemini returned an invalid response.", e);
        }
        Analysis analysis = new Analysis();
        analysis.setAtsScore(response.getAtsScore());
        analysis.setSummary(response.getSummary());
        analysis.setIdentifiedSkills(response.getIdentifiedSkills());
        analysis.setMissingSkills(response.getMissingSkills());
        analysis.setSuggestions(response.getSuggestions());
        analysis.setLearningRoadmap(response.getLearningRoadmap());
        analysis.setRecommendedProjects(response.getRecommendedProjects());
        analysis.setInterviewReadinessScore(response.getInterviewReadinessScore());
        analysis.setResume(resume);
        analysis.setJobDescription(jobDescription);
        analysis.setCreatedAt(LocalDateTime.now());
        analysisRepository.save(analysis);
        return response;
    }
    private String buildPrompt(Resume resume, JobDescription jobDescription) {
        return """
            You are an expert ATS (Applicant Tracking System) Resume Analyzer and Career Coach.

            Your task is to evaluate the candidate's resume against the provided job description as if you were an experienced technical recruiter.

            Instructions:
            1. Analyze how well the resume matches the job description.
            2. Calculate an ATS compatibility score from 0 to 100.
            3. Write a concise professional summary of the candidate's suitability.
            4. Identify the candidate's relevant technical and soft skills.
            5. Identify important skills or qualifications missing from the resume.
            6. Suggest specific improvements to increase the candidate's chances of getting shortlisted.
            7. Create a personalized learning roadmap to help the candidate become job-ready.
            8. Recommend 3-5 practical projects that would strengthen the candidate's resume.
            9. Estimate an Interview Readiness Score from 0 to 100 based on the resume's current quality.

            Resume:
            %s

            Job Title:
            %s

            Job Description:
            %s

            IMPORTANT:
            - Return ONLY valid JSON.
            - Do NOT include markdown.
            - Do NOT wrap the response inside ```json.
            - Do NOT include explanations, notes, or extra text.
            - Ensure the response is valid JSON that can be parsed directly.

            Use this exact JSON structure:

            {
                "atsScore": 0,
                "summary": "",
                "identifiedSkills": "",
                "missingSkills": "",
                "suggestions": "",
                "learningRoadmap": "",
                "recommendedProjects": "",
                "interviewReadinessScore": 0
            }
        """
        .formatted(
                resume.getExtractedText(),
                jobDescription.getTitle(),
                jobDescription.getDescription()
        );
    }
}
