package com.example.shelfshare.repository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.shelfshare.entity.BookStatus;
import com.example.shelfshare.entity.Books;

public interface BooksRepository extends CrudRepository<Books, Integer> {
    List<Books> findByCurrentOwner_Username(String username);
    List<Books> findByBookStatus(BookStatus bookStatus);
    
    @Query("SELECT b.bookId FROM Books b")
    List<Integer> findAllBookIdList();
}
