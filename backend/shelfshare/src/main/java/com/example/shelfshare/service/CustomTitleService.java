package com.example.shelfshare.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional; 
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import com.example.shelfshare.entity.Notes;
import com.example.shelfshare.model.CustomTitleRequest;
import com.example.shelfshare.model.CustomTitleResponse;


@Service
public class CustomTitleService {
    
    private String customTitleGenerationURL= "http://localhost:5000/get_master_title";

    private final RestTemplate restTemplate; 
    private final NotesService notesService;

    public CustomTitleService(RestTemplate restTemplate, NotesService notesService) {
        this.restTemplate = restTemplate;
        this.notesService = notesService;
    }

    
    public String getMasterCustomTitle(Integer bookId) {
        List<String> titlesList = new ArrayList<>();
        var notesList = notesService.findAllNotesByBookId(bookId);

        Optional<Notes> mostRecentNoteOptional = notesService.getMostRecentNoteForBook(bookId);
        String fallbackTitle = mostRecentNoteOptional.isPresent() ? mostRecentNoteOptional.get().getCustomizedTitle() : null;

        titlesList = notesList.stream()
                              .map(Notes::getCustomizedTitle)
                              .filter(title -> title != null && !title.trim().isEmpty())
                              .collect(Collectors.toList());

        if (titlesList.isEmpty()) {
            System.out.println("No valid customized titles found for bookId " + bookId + ". Cannot generate master title from API.");
            return fallbackTitle; // Return fallback if no titles to summarize, otherwise null
        }

        // Create the request payload for the Python API
        CustomTitleRequest requestPayLoad = new CustomTitleRequest(titlesList);
        System.out.println("Request Payload for Custom Title API: " + requestPayLoad);

        try {
            CustomTitleResponse customTitleResponse = restTemplate.postForObject(
                customTitleGenerationURL, requestPayLoad, CustomTitleResponse.class);

            if (customTitleResponse != null && customTitleResponse.master_title() != null && !customTitleResponse.master_title().trim().isEmpty()) {
                String master_title = customTitleResponse.master_title();
                System.out.println("Successfully generated master title for bookId " + bookId + ": " + master_title);
                return master_title; 
            } else {
                System.err.println("Error from Python Custom Title API for bookId " + bookId + ": Empty or null response body. Falling back.");
                return fallbackTitle; 
            }
        } catch (HttpClientErrorException e) {
            System.err.println("HttpClientErrorException communicating with Python Custom Title API for bookId " + bookId + ": " + e.getMessage() + " - " + e.getResponseBodyAsString() + ". Falling back.");
            return fallbackTitle; 
        } catch (Exception e) {
            System.err.println("Exception connecting to Python Custom Title API for bookId " + bookId + ": " + e.getMessage() + ". Falling back.");
            return fallbackTitle; 
        }
    }
}