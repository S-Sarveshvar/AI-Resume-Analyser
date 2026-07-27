package com.sarvesh.ResumeAnalyser.analysis.service;
import java.util.List;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.sarvesh.ResumeAnalyser.analysis.gemini.request.Content;
import com.sarvesh.ResumeAnalyser.analysis.gemini.request.GeminiRequest;
import com.sarvesh.ResumeAnalyser.analysis.gemini.request.Part;
import com.sarvesh.ResumeAnalyser.analysis.gemini.response.GeminiResponse;
import com.sarvesh.ResumeAnalyser.exception.GeminiException;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class GeminiService {
    private final RestClient restClient;
    @Value("${gemini.api.url}")
    private String apiUrl;
    @Value("${gemini.api.key}")
    private String apiKey;
    public GeminiService(RestClient restClient) {
        this.restClient = restClient;
    }
    public String generateContent(String prompt) {
        Part part = new Part(prompt);
        Content content = new Content();
        content.setParts(List.of(part));
        try {
            GeminiRequest request = new GeminiRequest();
            request.setContents(List.of(content));
            GeminiResponse response = restClient.post().uri(apiUrl+ "?key=" + apiKey).body(request).retrieve().body(GeminiResponse.class); 
            return response.getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText();
        }
        catch(RestClientException e) {
            throw new GeminiException("Unable to communicate with Gemini API", e);
        }
    }
}
