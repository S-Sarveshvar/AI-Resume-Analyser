package com.sarvesh.ResumeAnalyser.jobdescription.dto;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class JobDescriptionRequest {
    String title;
    String description;
}
