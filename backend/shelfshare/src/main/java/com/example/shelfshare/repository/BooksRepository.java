package com.example.shelfshare.repository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.shelfshare.entity.BookGenre;
import com.example.shelfshare.entity.BookStatus;
import com.example.shelfshare.entity.Books;

public interface BooksRepository extends CrudRepository<Books, Integer> {
    List<Books> findByCurrentOwner_Username(String username);
    
    List<Books> findByBookStatus(BookStatus bookStatus);
    
    List<Books> findByCurrentOwner_StateIgnoreCase(String state);
    
    List<Books> findByCurrentOwner_CountryIgnoreCase(String country);
    
    List<Books> findByCurrentOwner_AreaIgnoreCase(String area);

    List<Books> findByCurrentOwner_CityIgnoreCase(String city);

    List<Books> findByCurrentOwner_Pincode(String pincode);

    List<Books> findByBookGenre(BookGenre bookGenre);

    List<Books> findByAuthorNameIgnoreCase(String authorName);
    
    @Query("SELECT b.bookId FROM Books b")
    List<Integer> findAllBookIdList();

    List<Books> findByCurrentOwner_UsernameAndBookStatus(String username, BookStatus bookStatus);
}
