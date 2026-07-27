package com.sarvesh.ResumeAnalyser.analysis.dto;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisRequest {
    private MultipartFile resume;
    private String title;
    private String description;
}