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
import com.example.shelfshare.model.NoteSummarizationRequest;
import com.example.shelfshare.model.NoteSummarizationResponse;
import com.example.shelfshare.service.NotesService;


@RestController
@RequestMapping("/noteSummarization")
@CrossOrigin(origins = "http://localhost:5173")
public class NoteSummarizationController {
    
    private String noteSummarizationURL = "http://localhost:5000/get_summarized_text";

    private final RestTemplate restTemplate;

    private final NotesService notesService;

    public NoteSummarizationController(RestTemplate restTemplate, NotesService notesService) {
        this.restTemplate = restTemplate;
        this.notesService = notesService;
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<String> getSummarizedNote(@PathVariable Integer bookId) {
        List<String> notesContentList = new ArrayList<>();
        var notesList = notesService.findAllNotesByBookId(bookId);
        for (Notes note:notesList) {
            notesContentList.add(note.getNoteContent());
        }

        NoteSummarizationRequest requestPayLoad = new NoteSummarizationRequest(notesContentList);

        System.out.println(requestPayLoad);

        try {
            ResponseEntity<NoteSummarizationResponse> summarizedResponse = restTemplate.postForEntity(
                noteSummarizationURL, requestPayLoad, NoteSummarizationResponse.class);
            if (summarizedResponse.getStatusCode().is2xxSuccessful() && summarizedResponse.getBody()!=null) {
                String summarizedText = summarizedResponse.getBody().summary();
                return ResponseEntity.ok(summarizedText);
            } else {
                return ResponseEntity.status(summarizedResponse.getStatusCode())
                        .body("Error from Python API with status:"+summarizedResponse.getStatusCode()
                        + "-" + summarizedResponse.getBody());
            }
        } catch(HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body("Error communicating with Python API: "+e.getResponseBodyAsString());
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to connect to Python API: " + e.getMessage());
        }
    }
    
}
