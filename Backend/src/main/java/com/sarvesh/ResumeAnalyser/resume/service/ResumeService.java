package com.sarvesh.ResumeAnalyser.resume.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sarvesh.ResumeAnalyser.auth.repository.UserRepository;
import com.sarvesh.ResumeAnalyser.resume.dto.ResumeUploadResponse;
import com.sarvesh.ResumeAnalyser.resume.entity.Resume;
import com.sarvesh.ResumeAnalyser.resume.repository.ResumeRepository;
import com.sarvesh.ResumeAnalyser.auth.entity.User;

@Service
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final PdfExtractionService pdfExtractionService;
    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository, PdfExtractionService pdfExtractionService) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.pdfExtractionService = pdfExtractionService;
    }
    public Resume saveResume(MultipartFile file) throws IOException {
        // Receive uploaded PDF -> Validate it -> Store PDF on disk -> Store metadata in database -> Return success response
        if(file.isEmpty()) throw new RuntimeException("File not found");
        String fileName = file.getOriginalFilename();
        if(fileName == null) {
            throw new RuntimeException(
                    "Invalid file"
            );
        }
        String extension = fileName.substring(fileName.lastIndexOf("."));
        String id = UUID.randomUUID() + extension;
        Path path = Paths.get("uploads/resumes", id);  
        Files.copy(file.getInputStream(),path);
        Authentication authentication = SecurityContextHolder
                                            .getContext()
                                            .getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Resume resume = new Resume();
        resume.setFileName(fileName);
        resume.setFilePath(path.toString());
        resume.setUploadedAt(LocalDateTime.now());
        resume.setUser(user);
        String text = pdfExtractionService.extractText(file);
        resume.setExtractedText(text);
        return resumeRepository.save(resume);
        
    }
    public ResumeUploadResponse uploadResume(MultipartFile file) throws IOException {
        Resume resume = saveResume(file);
        return new ResumeUploadResponse(
                "Resume uploaded successfully",
                resume.getFileName()
        );
    }
}
