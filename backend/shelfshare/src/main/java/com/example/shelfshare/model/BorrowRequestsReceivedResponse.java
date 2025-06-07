package com.example.shelfshare.model;

public record BorrowRequestsReceivedResponse(Integer bookId,
                                            String bookTitle,
                                            String bookAuthor,
                                            Integer requesterUserId,
                                            String requesterName,
                                            String requesterUsername,
                                            String requesterEmail,
                                            String requesterPincode,
                                            String requesterArea,
                                            String requesterCity,
                                            String requesterState,
                                            String requesterCountry,
                                            String requestDate) {

}
