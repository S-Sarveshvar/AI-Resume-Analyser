package com.sarvesh.ResumeAnalyser.analysis.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sarvesh.ResumeAnalyser.analysis.dto.AnalysisRequest;
import com.sarvesh.ResumeAnalyser.analysis.dto.AnalysisResponse;
import com.sarvesh.ResumeAnalyser.analysis.service.AnalysisService;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalysisResponse> analyzeResume(@ModelAttribute AnalysisRequest request) throws IOException {
        AnalysisResponse response = analysisService.analyzeResume(request);
        return ResponseEntity.ok(response);
    }
}
