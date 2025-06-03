package com.example.shelfshare.model;

public record BookRequest(String bookTitle, String authorName, String bookGenre, Integer publicationYear, Boolean enlist) {
}
