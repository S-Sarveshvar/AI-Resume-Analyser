package com.sarvesh.ResumeAnalyser.analysis.entity;

import com.sarvesh.ResumeAnalyser.jobdescription.entity.JobDescription;
import com.sarvesh.ResumeAnalyser.resume.entity.Resume;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Analysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer atsScore;
    @Column(columnDefinition = "TEXT")
    private String summary;
    @Column(columnDefinition = "TEXT")
    private String identifiedSkills;
    @Column(columnDefinition = "TEXT")
    private String missingSkills;
    @Column(columnDefinition = "TEXT")
    private String suggestions;
    @Column(columnDefinition = "TEXT")
    private String learningRoadmap;
    @Column(columnDefinition = "TEXT")
    private String recommendedProjects;
    private Integer interviewReadinessScore;
    @OneToOne
    private Resume resume;
    @ManyToOne
    private JobDescription jobDescription;
}
