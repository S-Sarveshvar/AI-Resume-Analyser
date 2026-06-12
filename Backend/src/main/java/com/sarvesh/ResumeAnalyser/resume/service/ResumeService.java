package com.sarvesh.ResumeAnalyser.resume.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

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
    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }
    public ResumeUploadResponse uploadResume(MultipartFile file) throws IOException {
        if(file.isEmpty()) throw new RuntimeException("File not found");
        String fileName = file.getOriginalFilename();
        if(fileName == null) {
            throw new RuntimeException(
                    "Invalid file"
            );
        }
        Path path = Paths.get("uploads/resumes", fileName);
        Files.copy(file.getInputStream(), path);
        User user = userRepository.findById(1L).orElseThrow(() -> new RuntimeException("User not found"));
        Resume resume = new Resume();
        resume.setFileName(fileName);
        resume.setFilePath(path.toString());
        resume.setUploadedAt(LocalDateTime.now());
        resume.setUser(user);
        resume.setExtractedText(null);
        resumeRepository.save(resume);
        return new ResumeUploadResponse("Resume uploaded successfully", fileName);
    }
}
