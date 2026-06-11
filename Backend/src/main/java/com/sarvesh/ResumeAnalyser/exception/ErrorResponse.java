package com.sarvesh.ResumeAnalyser.exception;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ErrorResponse {
    private String message;
    public String getMessage() {
        return message;
    }
}