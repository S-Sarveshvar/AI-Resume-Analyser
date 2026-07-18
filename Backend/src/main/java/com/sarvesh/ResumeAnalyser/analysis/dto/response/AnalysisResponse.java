package com.sarvesh.ResumeAnalyser.analysis.dto.response;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@NoArgsConstructor
@AllArgsConstructor
@Data
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
