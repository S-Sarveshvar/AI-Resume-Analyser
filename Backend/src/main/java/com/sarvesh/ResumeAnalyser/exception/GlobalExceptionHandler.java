package com.sarvesh.ResumeAnalyser.exception;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(GeminiException.class)
    public ResponseEntity<ErrorResponse> handleGeminiException(GeminiException ex) {
        ex.printStackTrace();
        ErrorResponse errorResponse = new ErrorResponse(ex.getMessage()); 
        return ResponseEntity.internalServerError().body(errorResponse);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> handleIOException(IOException ex) {
        ex.printStackTrace();
        ErrorResponse errorResponse = new ErrorResponse(ex.getMessage()); 
        return ResponseEntity.internalServerError().body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)   
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace();
        ErrorResponse errorResponse = new ErrorResponse(ex.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    } 
}