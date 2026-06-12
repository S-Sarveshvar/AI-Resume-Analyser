package com.sarvesh.ResumeAnalyser.resume.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResumeUploadResponse {
    String message;
    String fileName;
}
