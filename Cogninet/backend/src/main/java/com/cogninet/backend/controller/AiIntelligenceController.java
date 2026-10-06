package com.cogninet.backend.controller;

import com.cogninet.backend.service.AiIntelligenceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiIntelligenceController {

    private final AiIntelligenceService aiIntelligenceService;

    public AiIntelligenceController(
            AiIntelligenceService aiIntelligenceService
    ) {
        this.aiIntelligenceService = aiIntelligenceService;
    }

    @GetMapping("/analyze")
    public Map<String, Object> analyze() {
        return aiIntelligenceService.analyze();
    }
}
