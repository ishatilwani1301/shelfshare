package com.example.shelfshare.repository;

import org.springframework.data.repository.CrudRepository;

import com.example.shelfshare.entity.Notes;

public interface NotesRepository extends CrudRepository<Notes, Integer> {
    
}
