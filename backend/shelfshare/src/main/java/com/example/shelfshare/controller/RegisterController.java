package com.example.shelfshare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shelfshare.model.RegisterRequest;
import com.example.shelfshare.model.RegisterResponse;
import com.example.shelfshare.service.UserService;


@RestController
@RequestMapping("/register")
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/createNewUser")
    public ResponseEntity<RegisterResponse> postMethodName(@RequestBody RegisterRequest req) {
        var createdUser = userService.createUser(req.username(), req.password(), req.email(), req.pincode());  
        return new ResponseEntity<RegisterResponse>(
            new RegisterResponse(createdUser.getUserId(), "User created successfully"), 
            HttpStatus.CREATED);
    }
    
    
}
