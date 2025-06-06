package com.example.shelfshare.service;

<<<<<<< HEAD
import java.util.List;
import java.util.NoSuchElementException;
=======
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
>>>>>>> origin/main

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
import com.example.shelfshare.entity.BookStatus;
import com.example.shelfshare.entity.Books;
import com.example.shelfshare.repository.BooksRepository;
=======
import com.example.shelfshare.entity.BookGenre;
import com.example.shelfshare.entity.BookStatus;
import com.example.shelfshare.entity.Books;
import com.example.shelfshare.entity.Notes;
import com.example.shelfshare.model.BookRequest;
import com.example.shelfshare.repository.BooksRepository;
import com.example.shelfshare.repository.NotesRepository;
>>>>>>> origin/main
import com.example.shelfshare.repository.UserRepository;

@Service
public class BookService {

<<<<<<< HEAD
    private final BooksRepository booksRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookService(BooksRepository booksRepository, UserRepository userRepository) {
        this.booksRepository = booksRepository;
        this.userRepository = userRepository;
    }
=======
    @Autowired
    private BooksRepository booksRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotesRepository notesRepository;
>>>>>>> origin/main

    public Books enlistBook(Integer bookId, String username) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new NoSuchElementException("User not found"));

        var book = booksRepository.findById(bookId)
            .orElse(null);
        if (book == null || !book.getCurrentOwner().getUsername().equals(username)) {
<<<<<<< HEAD
          return null;
=======
            return null;
>>>>>>> origin/main
        }
        book.setBookStatus(BookStatus.AVAILABLE);
        return booksRepository.save(book);
    }

<<<<<<< HEAD
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
=======
    public Boolean addNewBook(BookRequest request, String username) {
        var user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return false;
        }

        Books newBook = new Books();
        newBook.setBookTitle(request.bookTitle());
        newBook.setAuthorName(request.authorName());
        newBook.setBookGenre(BookGenre.valueOf(request.bookGenre()));
        newBook.setPublicationYear(request.publicationYear());
        newBook.setCurrentOwner(user.get());
        newBook.setPreviousOwners(List.of());
        newBook.setBookStatus(BookStatus.AVAILABLE);
        newBook.setEnlisted(true);
        newBook.setNotesId(new ArrayList<Integer>());

        var savedBook = booksRepository.save(newBook);

        Notes newNote = new Notes();
        newNote.setNoteContent(request.noteContent());
        newNote.setCustomizedTitle(request.customizedTitle());
        newNote.setBook(savedBook);
        newNote.setUser(user.get());
        newNote.setTimestamp(Instant.now());
        
        Notes savedNote = notesRepository.save(newNote);
        var updatedNotesArray = savedBook.getNotesId();
        updatedNotesArray.add(savedNote.getNoteId());
        savedBook.setNotesId(updatedNotesArray);
        booksRepository.save(savedBook);

        return true;
    }
>>>>>>> origin/main

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
<<<<<<< HEAD
=======

    public Optional<Books> getBookById(Integer bookId) {
        return booksRepository.findById(bookId);
    }

    public List<Integer> getAllBookIdList() {
        return booksRepository.findAllBookIdList();
    }
>>>>>>> origin/main
}
