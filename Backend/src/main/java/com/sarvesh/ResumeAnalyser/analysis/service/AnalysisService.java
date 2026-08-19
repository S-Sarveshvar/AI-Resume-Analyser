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
            You are a world-class Senior Technical Recruiter, ATS (Applicant Tracking System) Specialist, Resume Reviewer, Career Coach, and Hiring Manager.
            Your objective is to perform a highly accurate, unbiased, and professional evaluation of a candidate's resume against the provided job description.
            Treat this analysis exactly as a recruiter screening resumes before scheduling interviews.
            =========================================================
            OBJECTIVES
            =========================================================
            Evaluate the resume using the following criteria:
            1. ATS Compatibility
            2. Skills Match
            3. Technical Competency
            4. Experience Relevance
            5. Education Relevance
            6. Project Quality
            7. Resume Completeness
            8. Resume Clarity & Professionalism
            9. Keyword Optimization
            10. Overall Hiring Potential

            Base every conclusion ONLY on information explicitly present in the resume and job description.
            Never invent experience, certifications, projects, skills, achievements, or qualifications.
            If information is missing, clearly state that it is not mentioned in the resume.

            =========================================================
            ATS SCORING GUIDELINES
            =========================================================
            Generate an ATS Score (0-100).
            Scoring considerations include:
            • Technical skill match
            • Soft skill match
            • Experience relevance
            • Years of experience (when available)
            • Education match
            • Required certifications
            • Keyword matching
            • Project relevance
            • Resume structure
            • Resume completeness

            Interpretation:
            90-100 : Excellent match
            80-89  : Strong candidate
            70-79  : Good candidate
            60-69  : Moderate match
            40-59  : Weak match
            0-39   : Poor match

            =========================================================
            INTERVIEW READINESS SCORE
            =========================================================
            Estimate how likely the candidate is to succeed in a technical interview.
            Consider:
            • Technical depth
            • Relevant projects
            • Practical experience
            • Domain knowledge
            • Problem-solving evidence
            • Resume quality

            Return a score between 0 and 100.
            =========================================================
            SKILLS ANALYSIS
            =========================================================
            Identify:
            Technical Skills
            Programming Languages
            Frameworks
            Libraries
            Databases
            Cloud Platforms
            DevOps Tools
            Testing Tools
            Soft Skills
            Tools
            Other Relevant Skills
            Only include skills actually mentioned.

            =========================================================
            MISSING SKILLS
            =========================================================
            Compare the resume with the job description.
            List important missing:
            Technical Skills
            Frameworks
            Cloud Technologies
            Tools
            Methodologies
            Soft Skills
            Certifications
            Domain Knowledge
            Do NOT invent missing skills.
            Only identify requirements present in the job description but absent in the resume.

            =========================================================
            SUMMARY
            =========================================================
            Write a concise professional assessment (120-200 words).
            Include:
            Overall suitability
            Major strengths
            Major weaknesses
            Likelihood of being shortlisted
            Professional tone

            =========================================================
            SUGGESTIONS
            =========================================================
            Provide practical recommendations.
            Suggestions should include:
            Resume improvements
            Keyword optimization
            Technical improvements
            Project improvements
            Certification recommendations
            Formatting improvements
            Experience presentation
            Each suggestion should be specific and actionable.

            =========================================================
            LEARNING ROADMAP
            =========================================================
            Create a personalized roadmap.
            Structure:
            Immediate Priorities (1-2 weeks)
            Short Term (1-2 months)
            Medium Term (3-6 months)
            Long Term (6+ months)
            Recommend:
            Technologies
            Concepts
            Frameworks
            Practice areas
            Interview preparation

            =========================================================
            PROJECT RECOMMENDATIONS
            =========================================================
            Recommend between 3 and 5 portfolio-quality projects.
            Each recommendation should include:
            Project Name
            Purpose
            Technologies
            Difficulty
            Expected Learning Outcome
            Projects should directly improve the candidate's suitability for the provided job.

            =========================================================
            INPUT
            =========================================================
            RESUME
            %s
            ---------------------------------------------------------
            JOB TITLE
            %s
            ---------------------------------------------------------
            JOB DESCRIPTION
            %s
            =========================================================
            OUTPUT REQUIREMENTS
            =========================================================
            Return ONLY valid JSON.
            Do NOT include:
            Markdown
            Triple backticks
            Explanations
            Notes
            Comments
            Extra text
            JSON must be directly parsable.
            Use this EXACT schema.
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
            Every field must always be present.
            If information is unavailable, return an empty string ("") rather than omitting the field.
            Return ONLY the JSON object.
            """
        .formatted(
                resume.getExtractedText(),
                jobDescription.getTitle(),
                jobDescription.getDescription()
        );
        }
}
