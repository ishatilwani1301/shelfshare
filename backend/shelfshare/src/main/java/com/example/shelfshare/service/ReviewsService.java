package com.example.shelfshare.service;

import com.example.shelfshare.entity.Reviews;
import com.example.shelfshare.entity.Users;
import com.example.shelfshare.entity.Books;
import com.example.shelfshare.repository.ReviewsRepository;
import com.example.shelfshare.repository.UserRepository;
import com.example.shelfshare.repository.BooksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReviewsService {
    @Autowired
    private ReviewsRepository reviewsRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BooksRepository booksRepository;

    public Reviews addReview(Integer userId, Integer bookId, int ratings) {
        Optional<Users> userOpt = userRepository.findById(userId);
        Optional<Books> bookOpt = booksRepository.findById(bookId);
        if (userOpt.isEmpty() || bookOpt.isEmpty()) {
            return null;
        }
        Reviews review = new Reviews();
        review.setUser(userOpt.get());
        review.setBook(bookOpt.get());
        review.setRatings(ratings);
        return reviewsRepository.save(review);
    }

    public Iterable<Reviews> getReviewsForBook(Integer bookId) {
        return reviewsRepository.findAll(); // You can add a custom query for filtering by bookId
    }
}
