package com.example.shelfshare.controller;

import com.example.shelfshare.model.BookResponse;
import com.example.shelfshare.model.MessageResponse;
import com.example.shelfshare.repository.NotesRepository;
import com.example.shelfshare.model.BookRequest;
import com.example.shelfshare.service.BookService;
import com.example.shelfshare.service.NotesService;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.shelfshare.entity.Books;
import com.example.shelfshare.model.BookCreationResponse;
import com.example.shelfshare.model.BookLendApprovalRequest;
import com.example.shelfshare.service.UserService;


@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:5173")

public class BookController {

    private final BookService bookService;

    private final NotesRepository noteRepository;

    private final NotesService notesService;

    private final UserService userService;

    public BookController(BookService bookService, NotesRepository noteRepository, NotesService notesService, UserService userService) {
        this.bookService = bookService;
        this.noteRepository = noteRepository;
        this.notesService = notesService;
        this.userService = userService;
    }
   //*******TO DO
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
 
    //@GetMapping
    //public ResponseEntity<List<BookResponse>> getAllBooks() {
    //    List<Integer> bookIdList = bookService.getAllBookIdList();
     //   List<BookResponse> books = new ArrayList<>();
     //   for (Integer bookId : bookIdList) {
     //       var bookOptional = bookService.getBookById(bookId); // Renamed for clarity
     //       if (bookOptional.isPresent()) {
     //           Books book = bookOptional.get();
     //           books.add(buildBookResponse(book, "Book details retrieved successfully")); // Using the helper method
      //      }
       // }
//
  //      return new ResponseEntity<>(books, HttpStatus.OK);
    //}
    @GetMapping // This endpoint will now return only AVAILABLE books, it doesnt return books which are enlisted like previous one
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        List<Books> availableBooksEntities = bookService.getAllAvailableBooks();
        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : availableBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Book details retrieved successfully"));
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }

    @GetMapping("/my-books")
    public ResponseEntity<List<BookResponse>> getMyBooks(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        List<Books> myBooksEntities = bookService.getMyBooks(principal.getName());
        List<BookResponse> bookResponses = new ArrayList<>();

        for (Books book : myBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books you own!")); // Using the helper method
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }

    
    @GetMapping("/{bookId}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Integer bookId) {
        var bookOptional = bookService.getBookById(bookId); // Renamed for clarity
        if (bookOptional.isEmpty()) {
            return new ResponseEntity<BookResponse>(
                new BookResponse("Book not found"),
                HttpStatus.NOT_FOUND);
        }
        Books book = bookOptional.get();
        return new ResponseEntity<BookResponse>(
            buildBookResponse(book, "Book details retrieved successfully"), // Using the helper method
            HttpStatus.OK
        );
    }
    
    private BookResponse buildBookResponse(Books book, String message) {
        List<String> previousOwners = new ArrayList<>();
        if (book.getPreviousOwners() != null) { 
            previousOwners = book.getPreviousOwners()
                .stream()
                .map(owner -> owner.getUsername())
                .collect(Collectors.toList());
        }
        String currentOwnerUsername = (book.getCurrentOwner() != null) ? book.getCurrentOwner().getUsername() : null; // Defensive check for null current owner

        var notes = notesService.getMostRecentNoteForBook(book.getBookId());

        return new BookResponse(
            book.getBookId(),
            book.getBookTitle(),
            book.getAuthorName(),
            book.getBookGenre().name(),
            book.getPublicationYear(),
            book.getBookStatus().name(),
            book.getEnlisted(),
            currentOwnerUsername,
            previousOwners,
            notes.isPresent() ? notes.get().getNoteContent() : null,
            notes.isPresent() ? notes.get().getCustomizedTitle() : null,
            message
        );
    }

    @PostMapping("borrow/{bookId}")
    public ResponseEntity<MessageResponse> borrowBookByBookId(@PathVariable Integer bookId, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(new MessageResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }

        var bookOptional = bookService.getBookById(bookId);
        if (bookOptional.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse("Book not found"), HttpStatus.NOT_FOUND);
        }

        Books book = bookOptional.get();
        if (!book.getEnlisted()) {
            return new ResponseEntity<>(new MessageResponse("Book is not enlisted for borrowing"), HttpStatus.BAD_REQUEST);
        }

        if (book.getCurrentOwner() != null && book.getCurrentOwner().getUsername().equals(principal.getName())) {
            return new ResponseEntity<>(new MessageResponse("You cannot borrow your own book"), HttpStatus.BAD_REQUEST);
        }

        boolean bookBorrowedStatus = bookService.borrowBook(bookId, principal.getName());
        if (!bookBorrowedStatus) {
            return new ResponseEntity<>(new MessageResponse("Failed to send borrow request"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(new MessageResponse("Borrow request sent successfully"), HttpStatus.OK);
    }
    
    @PostMapping("/approve")
    public ResponseEntity<MessageResponse> approveRequest(@RequestBody BookLendApprovalRequest bookLendApprovalRequest, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(new MessageResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        if (bookLendApprovalRequest == null || bookLendApprovalRequest.bookId() == null || bookLendApprovalRequest.requesterUserId() == null) {
            return new ResponseEntity<>(new MessageResponse("Invalid request data"), HttpStatus.BAD_REQUEST);
        }
        var userOptional = userService.getUserByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse("User not found"), HttpStatus.NOT_FOUND);
        }
        var user = userOptional.get();
        boolean approvalStatus = bookService.approveBorrowRequest(bookLendApprovalRequest.bookId(), bookLendApprovalRequest.requesterUserId(), user.getUserId());
        if (!approvalStatus) {
            return new ResponseEntity<>(new MessageResponse("Failed to approve borrow request"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(new MessageResponse("Borrow request approved successfully"), HttpStatus.OK);
    }
    
}