package com.example.shelfshare.repository;

import com.example.shelfshare.entity.Reviews;
import org.springframework.data.repository.CrudRepository;

public interface ReviewsRepository extends CrudRepository<Reviews, Integer> {
    // Additional query methods can be defined here if needed
}
