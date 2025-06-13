package com.example.shelfshare.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shelfshare.entity.Books;
import com.example.shelfshare.model.AnonymousBookResponse;
import com.example.shelfshare.service.BookService;
import com.example.shelfshare.service.NoteSummarizationService;
import com.example.shelfshare.service.NotesService;


@RestController
@RequestMapping("/anonymous-books")
@CrossOrigin(origins = "http://localhost:5173")
public class AnonymousBookController {

    private final BookService bookService;
    private final NotesService notesService;
    private final NoteSummarizationService noteSummarizationService;

    @Autowired
    public AnonymousBookController(BookService bookService, NotesService notesService, NoteSummarizationService noteSummarizationService) {
        this.bookService = bookService;
        this.notesService = notesService;
        this.noteSummarizationService = noteSummarizationService;
    }

    @GetMapping
    public ResponseEntity<List<AnonymousBookResponse>> getAllBooks() {
        List<Books> bookList = bookService.getAllAvailableBooks();
        List<AnonymousBookResponse> anonymousBookResponses = new ArrayList<>();
        for (Books book : bookList) {
            anonymousBookResponses.add(buildAnonymousBookResponse(book, "Book details retrieved successfully!"));
        }
        return new ResponseEntity<>(anonymousBookResponses, HttpStatus.OK);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<AnonymousBookResponse> getAnonymousBookById(@PathVariable Integer bookId) {
        var bookOptional = bookService.getBookById(bookId);
        if (bookOptional.isEmpty()) {
            return new ResponseEntity<AnonymousBookResponse>(
                new AnonymousBookResponse("Book not found"),
                HttpStatus.NOT_FOUND);
        }
        Books book = bookOptional.get();
        return new ResponseEntity<AnonymousBookResponse>(
            buildAnonymousBookResponse(book, "Book details retrieved successfully"),
            HttpStatus.OK
        );
    }

    public AnonymousBookResponse buildAnonymousBookResponse(Books book, String message) {
        var summarizedNoteContent = noteSummarizationService.getSummarizedNoteContent(book.getBookId());
        var notes = notesService.getMostRecentNoteForBook(book.getBookId());
        var currentOwner = book.getCurrentOwner();
        return new AnonymousBookResponse(
            book.getBookId(),
            book.getBookGenre().name(),
            book.getAuthorName(),
            currentOwner.getUsername(),
            currentOwner.getArea(),
            currentOwner.getCity(),
            currentOwner.getState(),
            notes.isPresent() ? notes.get().getNoteId() : null,
            notes.isPresent() ? notes.get().getCustomizedTitle() : null,
            summarizedNoteContent,
            message
        );
    }
}