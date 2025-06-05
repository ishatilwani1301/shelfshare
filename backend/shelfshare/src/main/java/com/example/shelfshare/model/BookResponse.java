package com.example.shelfshare.model;

public record BookResponse(
        Integer id,
        String bookTitle,
        String authorName,
        String bookGenre,
        Integer publicationYear,
        String bookStatus,
        Boolean isEnlisted,
        String username,
        String message
) {


public BookResponse(String message) {
        this(null, null, null, null, null, null, null, null, message);
}
}