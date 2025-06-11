package com.example.shelfshare.model;

import java.util.List;

public record BookResponse(
        Integer id,
        String bookTitle,
        String authorName,
        String bookGenre,
        Integer publicationYear,
        String bookStatus,
        Boolean isEnlisted,
        String currentOwnerName,
        List<String> previousOwners,
        String userArea,
        String userCity,
        String userState,
        String noteContent,
        String customizedTitle,
        String message
) {

        public BookResponse(String message) {
                this(null, null, null, null, null, null, null, null, null, null, null, null, null, null, message);
        }
}