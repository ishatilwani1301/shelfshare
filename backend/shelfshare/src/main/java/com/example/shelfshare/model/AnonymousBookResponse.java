package com.example.shelfshare.model;

public record AnonymousBookResponse(
    Integer bookId,
    String bookGenre,
    String bookAuthor,
    String currentOwnerUsername,
    String currentOwnerName,
    String userArea,
    String userCity,
    String userState,
    Integer noteId,
    String CustomizedTitle,
    String noteContent,
    String message
) {
    public AnonymousBookResponse(String message) {
        this(null, null, null, null, null, null, null, null, null, null, null, message);
    }
}