package com.example.shelfshare.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shelfshare.entity.BookGenre;
import com.example.shelfshare.entity.BookStatus;
import com.example.shelfshare.entity.Books;
import com.example.shelfshare.entity.Notes;
import com.example.shelfshare.model.BookRequest;
import com.example.shelfshare.repository.BooksRepository;
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

    public Optional<Books> getBookById(Integer bookId) {
        return booksRepository.findById(bookId);
    }

    public List<Integer> getAllBookIdList() {
        return booksRepository.findAllBookIdList();
    }
}
