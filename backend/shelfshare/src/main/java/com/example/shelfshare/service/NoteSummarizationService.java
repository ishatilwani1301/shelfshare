package com.example.shelfshare.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.shelfshare.entity.Notes;
import com.example.shelfshare.model.NoteSummarizationRequest;
import com.example.shelfshare.model.NoteSummarizationResponse;

@Service
public class NoteSummarizationService {

    private String noteSummarizationURL = "http://localhost:5000/get_summarized_text";

    private final RestTemplate restTemplate;

    private final NotesService notesService;

    public NoteSummarizationService(RestTemplate restTemplate, NotesService notesService) {
        this.notesService = notesService;
        this.restTemplate = restTemplate;
    }

    public String getSummarizedNoteContent(Integer bookId) {
        List<String> notesContentList = new ArrayList<>();
        var notesList = notesService.findAllNotesByBookId(bookId);
        for (Notes note : notesList) {
            notesContentList.add(note.getNoteContent());
        }

        NoteSummarizationRequest requestPayLoad = new NoteSummarizationRequest(notesContentList);

        var mostRecentNote = notesService.getMostRecentNoteForBook(bookId);

        try {
            ResponseEntity<NoteSummarizationResponse> summarizedResponse = restTemplate.postForEntity(
                noteSummarizationURL, requestPayLoad, NoteSummarizationResponse.class);

            if (summarizedResponse.getStatusCode().is2xxSuccessful() && summarizedResponse.getBody() != null) {
                return summarizedResponse.getBody().summary();
            } else {
                // Log the error from the Python API
                System.err.println("Error from Python API for bookId " + bookId + ": " +
                                summarizedResponse.getStatusCode() + " - " + summarizedResponse.getBody());
                return mostRecentNote.isPresent() ? mostRecentNote.get().getNoteContent() : null;
            }
        } catch (HttpClientErrorException e) {
            System.err.println("Error communicating with Python API for bookId " + bookId + ": " + e.getResponseBodyAsString());
            return mostRecentNote.isPresent() ? mostRecentNote.get().getNoteContent() : null;
        } catch (Exception e) {
            System.err.println("Failed to connect to Python API for bookId " + bookId + ": " + e.getMessage());
            return mostRecentNote.isPresent() ? mostRecentNote.get().getNoteContent() : null;
        }
    }
    
}
