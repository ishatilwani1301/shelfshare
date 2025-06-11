package com.example.shelfshare.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    //******to do, get all books should be changed, to ensure only available books are listed here + build a common helper
    @GetMapping
    public ResponseEntity<List<AnonymousBookResponse>> getAllBooks() {
        List<Integer> bookIdList = bookService.getAllBookIdList();
        List<AnonymousBookResponse> Amonymousbooks = new ArrayList<>();
        for (Integer bookId : bookIdList) {
            Optional<Books> bookOptional = bookService.getBookById(bookId);
            if (bookOptional.isPresent()) {
                Books book = bookOptional.get();
                var summarizedNoteContent = noteSummarizationService.getSummarizedNoteContent(bookId);
                var notes = notesService.getMostRecentNoteForBook(book.getBookId());
                var currentOwner = book.getCurrentOwner();
                Amonymousbooks.add(new AnonymousBookResponse(
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
                    "Anonymous Book details retrieved successfully"
                ));
            }
        }
        return new ResponseEntity<>(Amonymousbooks, HttpStatus.OK);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<AnonymousBookResponse> getAnonymousBookById(@PathVariable Integer bookId) {
        Optional<Books> bookOptional = bookService.getBookById(bookId);
        if (bookOptional.isPresent()) {
            Books book = bookOptional.get();
            var notes = notesService.getMostRecentNoteForBook(book.getBookId());
            var summarizedNoteContent = noteSummarizationService.getSummarizedNoteContent(bookId);
            var currentOwner = book.getCurrentOwner();
            return new ResponseEntity<>(new AnonymousBookResponse(
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
                "Anonymous Book details retrieved successfully"
            ), HttpStatus.OK);
        } else {
            // Return a JSON response for NOT_FOUND
        return new ResponseEntity<>(new AnonymousBookResponse(
            null, null, null, null,null, null, null, null, null, null, "Book not found"
        ), HttpStatus.NOT_FOUND);
        }
    }
}