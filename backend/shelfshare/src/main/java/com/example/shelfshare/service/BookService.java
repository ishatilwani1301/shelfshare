package com.example.shelfshare.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shelfshare.entity.BookGenre;
import com.example.shelfshare.entity.BookStatus;
import com.example.shelfshare.entity.Books;
import com.example.shelfshare.entity.BorrowRequestStatus;
import com.example.shelfshare.entity.BorrowRequests;
import com.example.shelfshare.entity.Notes;
import com.example.shelfshare.model.BookRequest;
import com.example.shelfshare.repository.BooksRepository;
import com.example.shelfshare.repository.BorrowRequestRepository;
import com.example.shelfshare.repository.NotesRepository;
import com.example.shelfshare.repository.UserRepository;

@Service
public class BookService {

    @Autowired
    private BooksRepository booksRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotesRepository notesRepository;

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Transactional
    public Boolean enlistBook(Integer bookId, String username, String noteContent, String customizedTitle) {
        var userOptional = userRepository.findByUsername(username);
        var bookOptional = booksRepository.findById(bookId);

        if (userOptional.isEmpty() || bookOptional.isEmpty()) {
            return false; // User or book not found
        }

        var user = userOptional.get();
        var book = bookOptional.get();

        if (!book.getCurrentOwner().getUserId().equals(user.getUserId())) {
            return false; // User is not the owner of this book
        }

        if (book.getEnlisted() && book.getBookStatus() == BookStatus.AVAILABLE) {
            return false; // Book is already enlisted and available
        }

        book.setBookStatus(BookStatus.AVAILABLE);
        book.setEnlisted(true);

        if (noteContent != null || customizedTitle != null) {
            Notes newNote = new Notes();
            newNote.setNoteContent(noteContent);
            newNote.setCustomizedTitle(customizedTitle);
            newNote.setBook(book);
            newNote.setUser(user); // The enlisting user is the one adding this note
            newNote.setTimestamp(Instant.now());

            Notes savedNote = notesRepository.save(newNote);

            var updatedNotesArray = book.getNotesId();
            if (updatedNotesArray == null) {
                updatedNotesArray = new ArrayList<>();
            }
            updatedNotesArray.add(savedNote.getNoteId());
            book.setNotesId(updatedNotesArray);
        }

        booksRepository.save(book);

        var userBooksOwned = user.getBookOwned();
        if (userBooksOwned.contains(bookId)) {
            userBooksOwned.remove(bookId);
            user.setBookOwned(userBooksOwned);
        }

        var userBooksEnlistedForSale = user.getBooksEnlistedForSale();
        if (!userBooksEnlistedForSale.contains(bookId)) {
            userBooksEnlistedForSale.add(bookId);
            user.setBooksEnlistedForSale(userBooksEnlistedForSale);
        }
        userRepository.save(user);

        return true;
    }


    public Boolean addNewBook(BookRequest request, String username) {
        var userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return false;
        }
        var user = userOptional.get();
        Books newBook = new Books();
        newBook.setBookTitle(request.bookTitle());
        newBook.setAuthorName(request.authorName());
        newBook.setBookGenre(BookGenre.valueOf(request.bookGenre()));
        newBook.setPublicationYear(request.publicationYear());
        newBook.setCurrentOwner(user);
        newBook.setPreviousOwners(List.of());
        newBook.setBookStatus(BookStatus.AVAILABLE);
        newBook.setEnlisted(true);
        newBook.setNotesId(new ArrayList<Integer>());

        var savedBook = booksRepository.save(newBook);

        Notes newNote = new Notes();
        newNote.setNoteContent(request.noteContent());
        newNote.setCustomizedTitle(request.customizedTitle());
        newNote.setBook(savedBook);
        newNote.setUser(user);
        newNote.setTimestamp(Instant.now());
        
        Notes savedNote = notesRepository.save(newNote);
        var updatedNotesArray = savedBook.getNotesId();
        updatedNotesArray.add(savedNote.getNoteId());
        savedBook.setNotesId(updatedNotesArray);

        var booksEnlistedForSale = user.getBooksEnlistedForSale();
        booksEnlistedForSale.add(savedBook.getBookId());
        user.setBooksEnlistedForSale(booksEnlistedForSale);
        booksRepository.save(savedBook);
        userRepository.save(user);

        return true;
    }

    public List<Books> getAllAvailableBooks() {
        return booksRepository.findByBookStatus(BookStatus.AVAILABLE);
    }

    public List<Books> getMyBooks(String username) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        var myBooks = booksRepository.findByCurrentOwner_Username(username);
        return myBooks;
    }

    public Optional<Books> getBookById(Integer bookId) {
        return booksRepository.findById(bookId);
    }

    public List<Integer> getAllBookIdList() {
        return booksRepository.findAllBookIdList();
    }

    public List<Books> getBooksByOwnerState(String stateName) {
        return booksRepository.findByCurrentOwner_StateIgnoreCase(stateName);
    }

    public List<Books> getBooksByStatus(String statusName) {
        try {
            BookStatus status = BookStatus.valueOf(statusName.toUpperCase());
            return booksRepository.findByBookStatus(status);
        } catch (IllegalArgumentException e) {
            return new ArrayList<>(); // Return empty list for invalid status
        }
    }

    public List<Books> getBooksByOwnerCountry(String countryName) {
        return booksRepository.findByCurrentOwner_CountryIgnoreCase(countryName);
    }

    public List<Books> getBooksByOwnerArea(String areaName) {
        return booksRepository.findByCurrentOwner_AreaIgnoreCase(areaName);
    }

    public List<Books> getBooksByOwnerCity(String cityName) {
        return booksRepository.findByCurrentOwner_CityIgnoreCase(cityName);
    }

    public List<Books> getBooksByOwnerPincode(String pincode) {
        return booksRepository.findByCurrentOwner_Pincode(pincode);
    }

    public List<Books> getBooksByGenre(String genreName) {
        try {
            // Convert genreName string to BookGenre enum, case-insensitively
            BookGenre genre = BookGenre.valueOf(genreName.toUpperCase());
            return booksRepository.findByBookGenre(genre);
        } catch (IllegalArgumentException e) {
            return new ArrayList<>(); // Or throw a specific exception for invalid genre
        }
    }

    public List<Books> getBooksByAuthorName(String authorName) {
        return booksRepository.findByAuthorNameIgnoreCase(authorName);
    }


    @Transactional
    public Boolean borrowBook(Integer bookId, String username) {
        var userOptional = userRepository.findByUsername(username);
        var bookOptional = booksRepository.findById(bookId);

        if (userOptional.isEmpty() || bookOptional.isEmpty()) {
            return false;
        }

        var book = bookOptional.get();
        var requester = userOptional.get();

        var owner = book.getCurrentOwner();
        owner = userRepository.findById(owner.getUserId()).get();
        

        if (book.getBookStatus() != BookStatus.AVAILABLE) {
            return false;
        }
        
        BorrowRequests borrowRequest = new BorrowRequests();
        borrowRequest.setBook(book);
        borrowRequest.setRequester(requester);
        borrowRequest.setRequestDate(Instant.now());
        borrowRequest.setOwner(owner);
        borrowRequest.setStatus(BorrowRequestStatus.PENDING);

        BorrowRequests savedBorrowRequest = borrowRequestRepository.save(borrowRequest);

        var requesterSentBorrowRequests = requester.getBorrowRequestsSent();
        requesterSentBorrowRequests.add(savedBorrowRequest.getBorrowRequestId());
        requester.setBorrowRequestsSent(requesterSentBorrowRequests);

        userRepository.save(requester);

        var ownerReceivedBorrowRequests = owner.getBorrowRequestsReceived();
        ownerReceivedBorrowRequests.add(savedBorrowRequest.getBorrowRequestId());
        owner.setBorrowRequestsReceived(ownerReceivedBorrowRequests);

        userRepository.save(owner);

        book.setEnlisted(false);
        
        booksRepository.save(book);

        return true;
    }

    public Boolean approveBorrowRequest(Integer bookId, Integer requesterId, Integer ownerId) {
        var bookOptional = booksRepository.findById(bookId);
        var requesterOptional = userRepository.findById(requesterId);
        var ownerOptional = userRepository.findById(ownerId);

        if (bookOptional.isEmpty() || requesterOptional.isEmpty() || ownerOptional.isEmpty()) {
            return false;
        }

        var book = bookOptional.get();
        var requester = requesterOptional.get();
        var owner = ownerOptional.get();

        if (book.getBookStatus() != BookStatus.AVAILABLE) {
            return false;
        }
        var prevOwners = book.getPreviousOwners();
        prevOwners.add(book.getCurrentOwner());
        book.setPreviousOwners(prevOwners);

        book.setCurrentOwner(requester);
        book.setBookStatus(BookStatus.BORROWED);
        book.setEnlisted(false);

        booksRepository.save(book);

        // Update the borrow request status
        BorrowRequests borrowRequest = borrowRequestRepository.findFirstByBookBookIdAndRequesterUserIdAndOwnerUserIdOrderByRequestDateAsc(book.getBookId(), requester.getUserId(), owner.getUserId());
        if (borrowRequest != null) {
            borrowRequest.setStatus(BorrowRequestStatus.ACCEPTED);
            borrowRequestRepository.save(borrowRequest);

            //remove this borrow request from the owner's received requests
            var ownerReceivedRequests = owner.getBorrowRequestsReceived();
            ownerReceivedRequests.removeIf(br -> br.equals(borrowRequest.getBorrowRequestId()));
            owner.setBorrowRequestsReceived(ownerReceivedRequests);
            userRepository.save(owner);

            //remove this borrow request from the requester's sent requests
            var requesterSentRequests = requester.getBorrowRequestsSent();
            requesterSentRequests.removeIf(br -> br.equals(borrowRequest.getBorrowRequestId()));
            requester.setBorrowRequestsSent(requesterSentRequests);
            userRepository.save(requester);
        }

        //other borrow requests for the same book should be rejected
        List<BorrowRequests> otherRequests = borrowRequestRepository.findByBookBookIdAndStatus(book.getBookId(), BorrowRequestStatus.PENDING);
        for (BorrowRequests otherRequest : otherRequests) {
            if (!otherRequest.getRequester().getUserId().equals(requesterId)) {
                otherRequest.setStatus(BorrowRequestStatus.CANCELLED);
                borrowRequestRepository.save(otherRequest);
            }

            //remove this borrow request from the requester's sent requests
            var otherRequester = otherRequest.getRequester();
            var otherRequesterSentRequests = otherRequester.getBorrowRequestsSent();
            otherRequesterSentRequests.removeIf(br -> br.equals(otherRequest.getBorrowRequestId()));
            otherRequester.setBorrowRequestsSent(otherRequesterSentRequests);
            userRepository.save(otherRequester);

            //remove this borrow request from the owner's received requests
            var otherOwner = otherRequest.getOwner();
            var otherOwnerReceivedRequests = otherOwner.getBorrowRequestsReceived();
            otherOwnerReceivedRequests.removeIf(br -> br.equals(otherRequest.getBorrowRequestId()));
            otherOwner.setBorrowRequestsReceived(otherOwnerReceivedRequests);
            userRepository.save(otherOwner);
        }

        //books owned by the requester should be updated
        var booksOwnedByRequester = requester.getBookOwned();
        booksOwnedByRequester.add(book.getBookId());
        requester.setBookOwned(booksOwnedByRequester);
        userRepository.save(requester);

        return true;
    }


    public List<Books> getBooksBorrowed(String username) {
        var user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return new ArrayList<>();
        }
        // fetch the books where the current owner is the user and the book status is BORROWED
        return booksRepository.findByCurrentOwner_UsernameAndBookStatus(username, BookStatus.BORROWED);
    }
}
