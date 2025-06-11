package com.example.shelfshare.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shelfshare.entity.BookGenre;
import com.example.shelfshare.entity.BookStatus;
import com.example.shelfshare.entity.Books;
import com.example.shelfshare.model.BookResponse;
import com.example.shelfshare.service.BookService;
import com.example.shelfshare.service.NotesService;

@RestController
@RequestMapping("/filterBooks")
@CrossOrigin(origins = "http://localhost:5173")
public class FilterBooksController {
    private final BookService bookService;
    private final NotesService notesService;

    public FilterBooksController(BookService bookService, NotesService notesService) {
        this.bookService = bookService;
        this.notesService = notesService;
    }
    //******to do: cross verify this returns only those books which are of Bookstatus available
    @GetMapping("/state/{stateName}")
    public ResponseEntity<Object> getBooksByState(@PathVariable String stateName) {
        String normalizedStateName = stateName.trim();
        if (normalizedStateName.isEmpty()) {
            return new ResponseEntity<>("State name cannot be empty or just spaces. Please provide a valid state.", HttpStatus.BAD_REQUEST);
        }

        List<Books> filteredBooksEntities = bookService.getBooksByOwnerState(normalizedStateName);

        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : filteredBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books filtered by owner's state retrieved successfully"));
        }

        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }

    @GetMapping("/country/{countryName}")
    public ResponseEntity<Object> getBooksByOwnerCountry(@PathVariable String countryName) {
        String normalizedCountryName = countryName.trim();
        if (normalizedCountryName.isEmpty()) {
            return new ResponseEntity<>("Country name cannot be empty or just spaces. Please provide a valid country.", HttpStatus.BAD_REQUEST);
        }
        List<Books> filteredBooksEntities = bookService.getBooksByOwnerCountry(normalizedCountryName);
        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : filteredBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books filtered by owner's country retrieved successfully"));
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }

    @GetMapping("/area/{areaName}")
    public ResponseEntity<Object> getBooksByOwnerArea(@PathVariable String areaName) {
        String normalizedAreaName = areaName.trim();
        if (normalizedAreaName.isEmpty()) {
            return new ResponseEntity<>("Area name cannot be empty or just spaces. Please provide a valid area.", HttpStatus.BAD_REQUEST);
        }
        List<Books> filteredBooksEntities = bookService.getBooksByOwnerArea(normalizedAreaName);
        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : filteredBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books filtered by owner's area retrieved successfully"));
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }


    @GetMapping("/city/{cityName}")
    public ResponseEntity<Object> getBooksByOwnerCity(@PathVariable String cityName) {
        String normalizedCityName = cityName.trim();
        if (normalizedCityName.isEmpty()) {
            return new ResponseEntity<>("City name cannot be empty or just spaces. Please provide a valid city.", HttpStatus.BAD_REQUEST);
        }
        List<Books> filteredBooksEntities = bookService.getBooksByOwnerCity(normalizedCityName);
        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : filteredBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books filtered by owner's city retrieved successfully"));
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }

    @GetMapping("/author/{authorName}")
    public ResponseEntity<Object> getBooksByAuthorName(@PathVariable String authorName) {
        String normalizedAuthorName = authorName.trim();
        if (normalizedAuthorName.isEmpty()) {
            return new ResponseEntity<>("Author name cannot be empty or just spaces. Please provide a valid author name.", HttpStatus.BAD_REQUEST);
        }
        List<Books> filteredBooksEntities = bookService.getBooksByAuthorName(normalizedAuthorName);
        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : filteredBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books filtered by author name retrieved successfully"));
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }

    @GetMapping("/pincode/{pincode}")
    public ResponseEntity<Object> getBooksByOwnerPincode(@PathVariable String pincode) {
        String normalizedPincode = pincode.trim();
        if (normalizedPincode.isEmpty()) {
            return new ResponseEntity<>("Pincode cannot be empty or just spaces. Please provide a valid pincode.", HttpStatus.BAD_REQUEST);
        }
        List<Books> filteredBooksEntities = bookService.getBooksByOwnerPincode(normalizedPincode);
        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : filteredBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books filtered by owner's pincode retrieved successfully"));
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }

    @GetMapping("/genre/{genreName}")
    public ResponseEntity<Object> getBooksByGenre(@PathVariable String genreName) {
        if (!isValidBookGenre(genreName)) {
            return new ResponseEntity<>("Invalid book genre provided. Please use a valid genre like FICTION, NON_FICTION, SCIENCE_FICTION, etc.", HttpStatus.BAD_REQUEST);
        }
        List<Books> filteredBooksEntities = bookService.getBooksByGenre(genreName);
        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : filteredBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books filtered by genre retrieved successfully"));
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }


    @GetMapping("/bookStatus/{statusName}")
    public ResponseEntity<Object> getBooksByBookStatus(@PathVariable String statusName) {
        List<Books> filteredBooksEntities = bookService.getBooksByStatus(statusName);

        if (filteredBooksEntities.isEmpty() && !isValidBookStatus(statusName)) {
            return new ResponseEntity<>("Invalid book status provided. Please use AVAILABLE, BORROWED, LOST, ARCHIVED, or OWNED_PRIVATE.", HttpStatus.BAD_REQUEST);
        }

        List<BookResponse> bookResponses = new ArrayList<>();
        for (Books book : filteredBooksEntities) {
            bookResponses.add(buildBookResponse(book, "Books filtered by book status retrieved successfully"));
        }
        return new ResponseEntity<>(bookResponses, HttpStatus.OK);
    }


    //helpers
    private boolean isValidBookGenre(String genreName) {
        try {
            BookGenre.valueOf(genreName.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isValidBookStatus(String statusName) {
        try {
            BookStatus.valueOf(statusName.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private BookResponse buildBookResponse(Books book, String message) {
        List<String> previousOwners = new ArrayList<>();
        if (book.getPreviousOwners() != null) {
            previousOwners = book.getPreviousOwners()
                .stream()
                .map(owner -> owner.getUsername())
                .collect(Collectors.toList());
        }

        var currentOwner = (book.getCurrentOwner() != null) ? book.getCurrentOwner() : null;

        var notes = notesService.getMostRecentNoteForBook(book.getBookId());

        return new BookResponse(
            book.getBookId(),
            book.getBookTitle(),
            book.getAuthorName(),
            book.getBookGenre().name(),
            book.getPublicationYear(),
            book.getBookStatus().name(),
            book.getEnlisted(),
            currentOwner != null ? currentOwner.getUsername() : null,
            previousOwners,
            currentOwner != null ? currentOwner.getArea() : null,
            currentOwner != null ? currentOwner.getCity() : null,
            currentOwner != null ? currentOwner.getState() : null,
            notes.isPresent() ? notes.get().getNoteContent() : null,
            notes.isPresent() ? notes.get().getCustomizedTitle() : null,
            message
        );
    }

}
