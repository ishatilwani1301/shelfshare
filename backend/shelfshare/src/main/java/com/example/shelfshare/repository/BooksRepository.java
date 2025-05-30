package com.example.shelfshare.repository;

import org.springframework.data.repository.CrudRepository;

import com.example.shelfshare.entity.Books;

public interface BooksRepository extends CrudRepository<Books, Integer> {
    
}
