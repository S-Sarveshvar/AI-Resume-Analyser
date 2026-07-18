package com.sarvesh.ResumeAnalyser.analysis.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sarvesh.ResumeAnalyser.analysis.service.GeminiService;

import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/gemini")
public class GeminiControllerTest {
    private final GeminiService geminiService;
    public GeminiControllerTest(GeminiService geminiService) {
        this.geminiService = geminiService;
    }
    @PostMapping("/test")
    public String testGemini() {
        return geminiService.generateContent("Tell me a joke in one sentence");
    }
}
