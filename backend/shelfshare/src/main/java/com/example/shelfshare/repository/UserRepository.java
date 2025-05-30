package com.example.shelfshare.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.shelfshare.entity.Users;

public interface UserRepository extends CrudRepository<Users, Integer>{

    public Optional<Users> findByUsername(String username);
    
}
