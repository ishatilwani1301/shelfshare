package com.example.shelfshare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping; // Change to GetMapping
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shelfshare.model.RegisterRequest;
import com.example.shelfshare.model.RegisterResponse;
import com.example.shelfshare.model.UserAddressResponse;
import com.example.shelfshare.service.UserService;


@RestController
@RequestMapping("/register")
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping("/createNewUser")
    public ResponseEntity<RegisterResponse> createNewUser(@RequestBody RegisterRequest req) {
        // ... (your existing code for createNewUser)
        var createdUser = userService.createUser(req.name(), req.username(), req.password(), req.email(), req.pincode(), req.area(), req.city(), req.state(), req.country(), req.securityQuestionAnswers());
        if (createdUser.isEmpty()) {
            return new ResponseEntity<RegisterResponse>(
                new RegisterResponse(null, "Username already exists"),
                HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<RegisterResponse>(
            new RegisterResponse(createdUser.get().getUserId(), "User created successfully"),
            HttpStatus.CREATED);
    }

    // Change from @PostMapping to @GetMapping
    @GetMapping("/pincodeToAddress/{pincode}") // Change to GetMapping
    public ResponseEntity<UserAddressResponse> pincodeToAddress(@PathVariable String pincode) {
        UserAddressResponse addressResponse = userService.getAddressByPincode(pincode);

        if(addressResponse == null || addressResponse.area() == null || addressResponse.area().isEmpty()) {
            // Return 404 not found specifically if address data is empty/null
            return new ResponseEntity<UserAddressResponse>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<UserAddressResponse>(addressResponse, HttpStatus.OK);
    }
}