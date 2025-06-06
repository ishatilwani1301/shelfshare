package com.example.shelfshare.controller;

import com.example.shelfshare.entity.Books;
import com.example.shelfshare.entity.Notes;
import com.example.shelfshare.model.AnonymousBookResponse;
import com.example.shelfshare.model.BookResponse;
import com.example.shelfshare.service.BookService;
import com.example.shelfshare.service.NotesService;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/anonymous-books")
@CrossOrigin(origins = "http://localhost:5173")

public class AnonymousBookController {

    private final BookService bookService;
    private final NotesService notesService;

    @Autowired
    public AnonymousBookController(BookService bookService, NotesService notesService) {
        this.bookService = bookService;
        this.notesService = notesService;
    }
    @GetMapping
    public ResponseEntity<List<AnonymousBookResponse>> getAllBooks() {
        List<Integer> bookIdList = bookService.getAllBookIdList();
        List<AnonymousBookResponse> Amonymousbooks = new ArrayList<>(); // Initialize the list
        for (Integer bookId : bookIdList) {
            Optional<Books> bookOptional = bookService.getBookById(bookId);
            if (bookOptional.isPresent()) {
                //List<String> previousOwners = Anonymousbook.get().getPreviousOwners()
                //    .stream()
                //    .map(owner -> owner.getUsername())
                //    .toList();
                Books book = bookOptional.get();
                var notes = notesService.getMostRecentNoteForBook(book.getBookId()); // Removed .get() on 'book'
                Amonymousbooks.add(new AnonymousBookResponse( // Corrected list variable name
                    book.getBookId(),
                    //book.getBookTitle(),
                    //book.getAuthorName(),
                    //book.getBookGenre().name(),
                    //book.getPublicationYear(),
                    //book.getBookStatus().name(),
                    //book.getEnlisted(),
                    book.getCurrentOwner().getUsername(),
                    //previousOwners,
                    notes.isPresent() ? notes.get().getNoteId() : null,
                    notes.isPresent() ? notes.get().getCustomizedTitle() : null,
                    notes.isPresent() ? notes.get().getNoteContent() : null, // Added missing comma
                    "Anonymous Book details retrieved successfully"
                )); 
            } 
        }
        return new ResponseEntity<>(Amonymousbooks, HttpStatus.OK); // Corrected list variable name
    }
}