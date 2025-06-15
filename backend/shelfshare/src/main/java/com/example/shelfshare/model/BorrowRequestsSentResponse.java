package com.example.shelfshare.model;

public record BorrowRequestsSentResponse(Integer borrowRequestId,
                                        Integer bookId,                         
                                        String bookName,
                                        String author,
                                        String requestedDate,
                                        String requestedFromUsername,
                                        String acceptanceStatus) {};
