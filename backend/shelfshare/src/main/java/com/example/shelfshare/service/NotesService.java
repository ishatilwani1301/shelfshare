package com.example.shelfshare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.shelfshare.entity.Notes;
import com.example.shelfshare.repository.NotesRepository;

@Service
public class NotesService {

    private final NotesRepository notesRepository;

    public NotesService(NotesRepository notesRepository) {
        this.notesRepository = notesRepository;
    }
    
    public Optional<Notes> findNotesById(Integer noteId) {
        return notesRepository.findById(noteId);
    }

    public Optional<Notes> getMostRecentNoteForBook(Integer bookId) {
        return notesRepository.findTopByBookBookIdOrderByTimestampDesc(bookId);
    }

    public List<Notes> findAllNotesByBookId(Integer bookId) {
        return notesRepository.findByBookBookId(bookId);
    }
}
