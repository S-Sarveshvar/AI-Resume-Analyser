package com.sarvesh.ResumeAnalyser.analysis.gemini.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiResponse {
    List<Candidate> candidates;
}
