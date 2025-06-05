package com.example.shelfshare.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shelfshare.entity.Users;
import com.example.shelfshare.model.UserDetailsChangeRequest;
import com.example.shelfshare.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private PasswordEncoder encoder;

    public UserService() {
        this.encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    public Optional<Users> createUser(String username, String password, String email, String pincode) {
        if (userRepository.findByUsername(username).isPresent()) {
            return Optional.empty();
        }
        var user = new Users();
        user.setUsername(username);
        user.setPasswordDigest(encoder.encode(password));
        user.setUserEmail(email);
        user.setPincode(pincode);
        user.setIsAdmin(false);
        return Optional.of(userRepository.save(user));
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

    public Boolean checkPassword(Users user, String passwordFromRequest) {
        return encoder.matches(passwordFromRequest, user.getPasswordDigest());
    }

    public Boolean changePassword(Users user, String newPassword) {
        user.setPasswordDigest(encoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public Boolean changeUserDetails(Users user, UserDetailsChangeRequest request) {
        if (request.username() != null && !request.username().isEmpty()) {
            user.setUsername(request.username());
        }
        if (request.email() != null && !request.email().isEmpty()) {
            user.setUserEmail(request.email());
        }
        if (request.pincode() != null && !request.pincode().isEmpty()) {
            user.setPincode(request.pincode());
        }
        userRepository.save(user);
        return true;
    }

    public Boolean deleteUser(Users user) {
        userRepository.delete(user);
        return true;
    }

    // public Optional<UserAddressResponse> getAddressByPincode(String pincode) {
    //     if (pincode == null || pincode.isEmpty()) {
    //         return Optional.empty();
    //     }
    //     addressResponse = 
    //     // Mocked response for demonstration purposes
    //     return Optional.of(new UserAddressResponse("District", "Region", "State", "Country"));
    // }
}
