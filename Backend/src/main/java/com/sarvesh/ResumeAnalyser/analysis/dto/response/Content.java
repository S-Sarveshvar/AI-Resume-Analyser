package com.sarvesh.ResumeAnalyser.analysis.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Content {
    List<Part> parts;
}
