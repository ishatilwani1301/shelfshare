package com.example.shelfshare.controller;

import com.example.shelfshare.model.BookResponse;
import com.example.shelfshare.repository.NotesRepository;
import com.example.shelfshare.model.BookRequest;
import com.example.shelfshare.service.BookService;
import com.example.shelfshare.service.NotesService;
import com.example.shelfshare.entity.Books;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.shelfshare.model.BookCreationResponse;


@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    private final NotesRepository noteRepository;

    private final NotesService notesService;

    public BookController(BookService bookService, NotesRepository noteRepository, NotesService notesService) {
        this.bookService = bookService;
        this.noteRepository = noteRepository;
        this.notesService = notesService;
    }

    // @PostMapping("/enlist/{bookId}")
    // public ResponseEntity<BookResponse> enlistBook(@PathVariable Integer bookId, Principal principal) {
    //     if (principal == null) {
    //         return new ResponseEntity<BookResponse>(new BookResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
    //     }

    //     var updatedBook = bookService.enlistBook(bookId, principal.getName());
    //     if (updatedBook == null) {
    //         return new ResponseEntity<BookResponse>(new BookResponse("Book not found or user not owner"), HttpStatus.BAD_REQUEST);
    //     }

    //     return new ResponseEntity<>(mapBookToDto(updatedBook, "Book enlisted successfully"), HttpStatus.OK);
    // }

    @PostMapping("/addNewBook")
    public ResponseEntity<BookCreationResponse> addNewBook(@RequestBody BookRequest req, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<BookCreationResponse>(new BookCreationResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }

        Boolean bookCreationStatus = bookService.addNewBook(req, principal.getName());
        if(!bookCreationStatus) {
            return new ResponseEntity<>(new BookCreationResponse("Failed to create book"), HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(new BookCreationResponse("Book created successfully"), HttpStatus.CREATED);
        }
    }

    // @GetMapping
    // public ResponseEntity<List<BookResponse>> getAllBooks() {
    //     List<BookResponse> books = bookService.getAllAvailableBooks()
    //             .stream()
    //             .map(book -> mapBookToDto(book, "books available to borrow/buy"))
    //             .toList();
    //     return new ResponseEntity<>(books, HttpStatus.OK);
    // }

    // @GetMapping("/my-books")
    // public ResponseEntity<List<BookResponse>> getMyBooks(Principal principal) {
    //     if (principal == null) {
    //         return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    //     }
    //     List<BookResponse> books = bookService.getMyBooks(principal.getName())
    //             .stream()
    //             .map(book -> mapBookToDto(book, "Books you own!"))
    //             .toList();
    //     return new ResponseEntity<>(books, HttpStatus.OK);
    // }

    // private BookResponse mapBookToDto(Books book, String message) {
    //     return new BookResponse(
    //             book.getBookId(),
    //             book.getBookTitle(),
    //             book.getAuthorName(),
    //             book.getBookGenre().name(),
    //             book.getPublicationYear(),
    //             book.getBookStatus().name(),
    //             book.getEnlisted(),
    //             book.getCurrentOwner().getUsername(),
    //             message
    //     );
    // }

    @GetMapping("/{bookId}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Integer bookId) {
        var book = bookService.getBookById(bookId);
        if (book.isEmpty()) {
            return new ResponseEntity<BookResponse>(
                new BookResponse("Book not found"),
                HttpStatus.NOT_FOUND);
        }
        var notedIdList = book.get().getNotesId();
        List<String> previousOwners = book.get().getPreviousOwners()
            .stream()
            .map(owner -> owner.getUsername())
            .toList();
        var notes = notesService.getMostRecentNoteForBook(book.get().getBookId());
        return new ResponseEntity<BookResponse>(
            new BookResponse(
                book.get().getBookId(),
                book.get().getBookTitle(),
                book.get().getAuthorName(),
                book.get().getBookGenre().name(),
                book.get().getPublicationYear(),
                book.get().getBookStatus().name(),
                book.get().getEnlisted(),
                book.get().getCurrentOwner().getUsername(),
                previousOwners,
                notes.isPresent() ? notes.get().getNoteContent() : null,
                notes.isPresent() ? notes.get().getCustomizedTitle() : null,
                "Book details retrieved successfully"
            ),
            HttpStatus.OK
        );
    }
}