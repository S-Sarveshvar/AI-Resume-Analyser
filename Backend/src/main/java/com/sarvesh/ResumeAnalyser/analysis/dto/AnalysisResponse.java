package com.sarvesh.ResumeAnalyser.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {

    private Integer atsScore;

    private String summary;

    private String identifiedSkills;

    private String missingSkills;

    private String suggestions;

    private String learningRoadmap;

    private String recommendedProjects;

    private Integer interviewReadinessScore;
}