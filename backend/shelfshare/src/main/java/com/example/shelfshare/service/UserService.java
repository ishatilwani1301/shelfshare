package com.example.shelfshare.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shelfshare.entity.Users;
import com.example.shelfshare.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private PasswordEncoder encoder;

    public UserService() {
        this.encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    public Users createUser(String username, String password, String email, String pincode) {
        var user = new Users();
        user.setUsername(username);
        user.setPasswordDigest(encoder.encode(password));
        user.setUserEmail(email);
        user.setPincode(pincode);
        user.setAdmin(false);
        return userRepository.save(user);
    }

    public Optional<Users> getAuthenticatedUser(String username, String password) {
        var userInDb = userRepository.findByUsername(username);
        if (userInDb.isEmpty()) {
            return Optional.empty();
        }
        if (encoder.matches(password, userInDb.get().getPasswordDigest())) {
            return userInDb;
        } else {
            return Optional.empty();
        }
    }

    public Optional<Users> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

}
