package com.example.shelfshare.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shelfshare.entity.BookStatus;
import com.example.shelfshare.entity.Books;
import com.example.shelfshare.repository.BooksRepository;
import com.example.shelfshare.repository.UserRepository;

@Service
public class BookService {

    private final BooksRepository booksRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookService(BooksRepository booksRepository, UserRepository userRepository) {
        this.booksRepository = booksRepository;
        this.userRepository = userRepository;
    }

    public Books enlistBook(Integer bookId, String username) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new NoSuchElementException("User not found"));

        var book = booksRepository.findById(bookId)
            .orElse(null);
        if (book == null || !book.getCurrentOwner().getUsername().equals(username)) {
          return null;
        }
        book.setBookStatus(BookStatus.AVAILABLE);
        return booksRepository.save(book);
    }

    // public Books addNewBook(BookRequest bookRequest, String username) {
    //     var user = userRepository.findByUsername(username)
    //         .orElseThrow(() -> new NoSuchElementException("User not found"));
    //         var bookStatus = bookRequest.enlist() ? BookStatus.AVAILABLE : BookStatus.OWNED_PRIVATE;
    //         var newBook = new Books(
    //         bookRequest.bookTitle(),
    //         bookRequest.authorName(),
    //         BookGenre.valueOf(bookRequest.bookGenre()),
    //         bookRequest.publicationYear(),
    //         user,
    //         List.of(),
    //         bookStatus,
    //         bookRequest.enlist() 
    //     );
    //     return booksRepository.save(newBook);
    // }

    public List<Books> getAllAvailableBooks() {
        return booksRepository.findByBookStatus(BookStatus.AVAILABLE);
    }

    public List<Books> getMyBooks(String username) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        var myBooks = booksRepository.findByCurrentOwner_Username(username);
        // TODO: Add logic to get also the borrowed books by this user.
        return myBooks;
    }
}
