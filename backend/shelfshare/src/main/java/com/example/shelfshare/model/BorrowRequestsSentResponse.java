package com.example.shelfshare.model;

public record BorrowRequestsSentResponse(String bookName,
                                        String author,
                                        String requestedDate,
                                        String requestedFromUsername,
                                        String acceptanceStatus) {};
