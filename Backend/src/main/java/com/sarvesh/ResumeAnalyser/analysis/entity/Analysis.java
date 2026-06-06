package com.sarvesh.ResumeAnalyser.analysis.entity;

import com.sarvesh.ResumeAnalyser.resume.entity.Resume;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
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
    private String summary;
    private String skills;
    private String suggestions;
    @OneToOne
    private Resume resume;
}
