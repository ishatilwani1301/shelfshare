package com.example.shelfshare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.shelfshare.entity.Notes;

public interface NotesRepository extends CrudRepository<Notes, Integer> {

    Optional<Notes> findTopByBookBookIdOrderByTimestampDesc(Integer bookId);

    List<Notes> findByBookBookId(Integer bookId);
    
}
