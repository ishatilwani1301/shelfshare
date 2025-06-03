package com.example.shelfshare.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shelfshare.model.UserDetailsResponse;
import com.example.shelfshare.service.UserService;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/userDetails")
    public ResponseEntity<UserDetailsResponse> getUserDetails(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<UserDetailsResponse>(
                new UserDetailsResponse(null, null, null),
                HttpStatus.UNAUTHORIZED
            );
        }

        var user = userService.getUserByUsername(principal.getName());
        if (user.isEmpty()) {
            return new ResponseEntity<UserDetailsResponse>(
                new UserDetailsResponse(null, null, null),
                HttpStatus.NOT_FOUND
            );
        } else {
            var userDetails = user.get();
            return new ResponseEntity<UserDetailsResponse>(new UserDetailsResponse(
                userDetails.getUsername(),
                userDetails.getUserEmail(),
                userDetails.getPincode()
            ), HttpStatus.OK);
        }
    }
}
