package com.sarvesh.ResumeAnalyser.analysis.service;
import java.util.List;
import org.springframework.web.client.RestClient;

import com.sarvesh.ResumeAnalyser.analysis.dto.GeminiRequest;
import com.sarvesh.ResumeAnalyser.analysis.dto.Part;
import com.sarvesh.ResumeAnalyser.analysis.dto.Content;

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
        GeminiRequest request = new GeminiRequest();
        request.setContents(List.of(content));
        String response = restClient.post().uri(apiUrl+ "?key=" + apiKey).body(request).retrieve().body(String.class);  
        System.out.println(response);   
        return response;
    }
}
