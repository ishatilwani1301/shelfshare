package com.example.shelfshare.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.shelfshare.entity.Notes;
import com.example.shelfshare.model.CustomTitleRequest;
import com.example.shelfshare.model.CustomTitleResponse;
import com.example.shelfshare.model.NoteSummarizationRequest;
import com.example.shelfshare.model.NoteSummarizationResponse;
import com.example.shelfshare.service.NotesService;


@RestController
@RequestMapping("/noteSummarization")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomTitleController {
    
    private String customTitleGenerationURL = "http://localhost:5000/get_master_title";

    private final RestTemplate restTemplate; 

    private final NotesService notesService;

    public CustomTitleController(RestTemplate restTemplate, NotesService notesService) {
        this.restTemplate = restTemplate;
        this.notesService = notesService;
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<String> getMasterCustomTitle(@PathVariable Integer bookId) {
        List<String> titlesList = new ArrayList<>();

        var notesList = notesService.findAllNotesByBookId(bookId);

        for (Notes note : notesList) {
            if (note.getCustomizedTitle() != null && !note.getCustomizedTitle().trim().isEmpty()) {
                titlesList.add(note.getCustomizedTitle());
            }
        }

        // If no customized titles are found, return an appropriate message
        if (titlesList.isEmpty()) {
            return ResponseEntity.ok("No customized titles available for this book.");
        }

        // Create the request payload for the Python API
        CustomTitleRequest requestPayLoad = new CustomTitleRequest(titlesList);
        System.out.println("Request Payload for Custom Title API: " + requestPayLoad);

        try {
            ResponseEntity<CustomTitleResponse> customTitleResponse = restTemplate.postForEntity(
                customTitleGenerationURL, requestPayLoad, CustomTitleResponse.class);

            if (customTitleResponse.getStatusCode().is2xxSuccessful() && customTitleResponse.getBody() != null) {
                String master_title = customTitleResponse.getBody().master_title(); // Ensure getter matches Python response key
                return ResponseEntity.ok(master_title);
            } else {
                return ResponseEntity.status(customTitleResponse.getStatusCode())
                        .body("Error from Python API with status: " + customTitleResponse.getStatusCode()
                        + " - " + (customTitleResponse.getBody() != null ? customTitleResponse.getBody().toString() : "No response body"));
            }
        } catch (HttpClientErrorException e) {
            System.err.println("HttpClientErrorException: " + e.getMessage());
            return ResponseEntity.status(e.getStatusCode())
                    .body("Error communicating with Python API: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to connect to Python API or an internal error occurred: " + e.getMessage());
        }
    }
}
