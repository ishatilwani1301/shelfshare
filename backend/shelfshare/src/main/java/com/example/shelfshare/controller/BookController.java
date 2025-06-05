package com.example.shelfshare.controller;

import com.example.shelfshare.model.BookResponse;
import com.example.shelfshare.model.BookRequest;
import com.example.shelfshare.service.BookService;
import com.example.shelfshare.entity.Books;

import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping("/enlist/{bookId}")
    public ResponseEntity<BookResponse> enlistBook(@PathVariable Integer bookId, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<BookResponse>(new BookResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }

        var updatedBook = bookService.enlistBook(bookId, principal.getName());
        if (updatedBook == null) {
            return new ResponseEntity<BookResponse>(new BookResponse("Book not found or user not owner"), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(mapBookToDto(updatedBook, "Book enlisted successfully"), HttpStatus.OK);
    }

    // @PostMapping("/add")
    // public ResponseEntity<BookResponse> addNewBook(@RequestBody BookRequest bookRequest, Principal principal) {
    //     if (principal == null) {
    //         return new ResponseEntity<BookResponse>(new BookResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
    //     }

    //     var createdBook = bookService.addNewBook(bookRequest, principal.getName());
    //     return new ResponseEntity<>(mapBookToDto(createdBook, "Book added successfully"), HttpStatus.CREATED);
    // }

    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        List<BookResponse> books = bookService.getAllAvailableBooks()
                .stream()
                .map(book -> mapBookToDto(book, "books available to borrow/buy"))
                .toList();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/my-books")
    public ResponseEntity<List<BookResponse>> getMyBooks(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        List<BookResponse> books = bookService.getMyBooks(principal.getName())
                .stream()
                .map(book -> mapBookToDto(book, "Books you own!"))
                .toList();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    private BookResponse mapBookToDto(Books book, String message) {
        return new BookResponse(
                book.getBookId(),
                book.getBookTitle(),
                book.getAuthorName(),
                book.getBookGenre().name(),
                book.getPublicationYear(),
                book.getBookStatus().name(),
                book.getEnlisted(),
                book.getCurrentOwner().getUsername(),
                message
        );
    }
}