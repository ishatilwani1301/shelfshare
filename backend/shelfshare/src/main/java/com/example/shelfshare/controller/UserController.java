package com.example.shelfshare.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shelfshare.model.BorrowRequestsSentResponse;
import com.example.shelfshare.model.MessageResponse;
import com.example.shelfshare.model.UserDetailsChangeRequest;
import com.example.shelfshare.model.UserDetailsResponse;
import com.example.shelfshare.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping; // <--- ADD THIS IMPORT
import org.springframework.web.bind.annotation.RequestBody;

import com.example.shelfshare.model.UserPasswordChangeRequest;
import com.example.shelfshare.model.UserPasswordChangeResponse;

import org.springframework.web.bind.annotation.RequestParam;

import com.example.shelfshare.model.BorrowRequestsReceivedResponse;
import com.example.shelfshare.model.ValidateSecurityQuestionRequest;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/userDetails")
    public ResponseEntity<UserDetailsResponse> getUserDetails(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<UserDetailsResponse>(
                new UserDetailsResponse(null, null, null, null, null, null, null, null),
                HttpStatus.UNAUTHORIZED
            );
        }

        var user = userService.getUserByUsername(principal.getName());
        if (user.isEmpty()) {
            return new ResponseEntity<UserDetailsResponse>(
                new UserDetailsResponse(null, null, null, null, null, null, null, null),
                HttpStatus.NOT_FOUND
            );
        } else {
            var userDetails = user.get();
            return new ResponseEntity<UserDetailsResponse>(new UserDetailsResponse(
                userDetails.getName(),
                userDetails.getUsername(),
                userDetails.getUserEmail(),
                userDetails.getPincode(),
                userDetails.getArea(),
                userDetails.getCity(),
                userDetails.getState(),
                userDetails.getCountry()
            ), HttpStatus.OK);
        }
    }

    @PostMapping("/changeUserPassword")
    public ResponseEntity<UserPasswordChangeResponse> userPasswordChange(@RequestBody UserPasswordChangeRequest request, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<UserPasswordChangeResponse>(
                new UserPasswordChangeResponse("User not authenticated"),
                HttpStatus.UNAUTHORIZED
            );
        } else {
            var user = userService.getUserByUsername(principal.getName());
            if (user.isEmpty()) {
                return new ResponseEntity<UserPasswordChangeResponse>(
                    new UserPasswordChangeResponse("User not found"),
                    HttpStatus.NOT_FOUND
                );
            }

            var userInDb = user.get();
            if (!userService.checkPassword(userInDb, request.oldPassword())) {
                return new ResponseEntity<UserPasswordChangeResponse>(
                    new UserPasswordChangeResponse("Old password is incorrect"),
                    HttpStatus.BAD_REQUEST
                );
            }

            if (userService.changePassword(userInDb, request.newPassword())) {
                return new ResponseEntity<UserPasswordChangeResponse>(
                    new UserPasswordChangeResponse("Password changed successfully"),
                    HttpStatus.OK
                );
            } else {
                return new ResponseEntity<UserPasswordChangeResponse>(
                    new UserPasswordChangeResponse("Failed to change password"),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    @PutMapping("/changeUserDetails") // <--- CHANGED FROM @PostMapping TO @PutMapping
    public ResponseEntity<UserPasswordChangeResponse> changeUserDetails(@RequestBody UserDetailsChangeRequest userDetails, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<UserPasswordChangeResponse>(
                new UserPasswordChangeResponse("User not authenticated"),
                HttpStatus.UNAUTHORIZED
            );
        }

        var user = userService.getUserByUsername(principal.getName());
        if (user.isEmpty()) {
            return new ResponseEntity<UserPasswordChangeResponse>(
                new UserPasswordChangeResponse("User not found"),
                HttpStatus.NOT_FOUND
            );
        }

        var userInDb = user.get();
        if (userService.changeUserDetails(userInDb, userDetails)) {
            return new ResponseEntity<UserPasswordChangeResponse>(
                new UserPasswordChangeResponse("User details changed successfully"),
                HttpStatus.OK
            );
        } else {
            return new ResponseEntity<UserPasswordChangeResponse>(
                new UserPasswordChangeResponse("Failed to change user details"),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PostMapping("/deleteUser")
    public ResponseEntity<UserPasswordChangeResponse> deleteUser(Principal principal) {
        var username = principal.getName();
        var user = userService.getUserByUsername(username);
        if (user.isEmpty()) {
            return new ResponseEntity<UserPasswordChangeResponse>(
                new UserPasswordChangeResponse("User not found"),
                HttpStatus.NOT_FOUND
            );
        }
        var userInDb = user.get();
        userService.deleteUser(userInDb);
        return new ResponseEntity<UserPasswordChangeResponse>(
            new UserPasswordChangeResponse("User deleted successfully"),
            HttpStatus.OK
        );
    }


    @GetMapping("/borrowRequestsSent")
    public ResponseEntity<List<BorrowRequestsSentResponse>> getBorrowRequestsSent(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<List<BorrowRequestsSentResponse>>(HttpStatus.UNAUTHORIZED);
        }
        var username = principal.getName();
        var user = userService.getUserByUsername(username);
        if (user.isEmpty()) {
            return new ResponseEntity<List<BorrowRequestsSentResponse>>(HttpStatus.NOT_FOUND);
        }
        var userInDb = user.get();
        var borrowRequests = userService.getBorrowRequestsSent(userInDb);
        if (borrowRequests.isEmpty()) {
            return new ResponseEntity<List<BorrowRequestsSentResponse>>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<List<BorrowRequestsSentResponse>>(borrowRequests, HttpStatus.OK);
    }
    
    @GetMapping("/borrowRequestsReceived")
    public ResponseEntity<List<BorrowRequestsReceivedResponse>> getBorrowRequestsReceived(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<List<BorrowRequestsReceivedResponse>>(HttpStatus.UNAUTHORIZED);
        }
        var username = principal.getName();
        var user = userService.getUserByUsername(username);
        if (user.isEmpty()) {
            return new ResponseEntity<List<BorrowRequestsReceivedResponse>>(HttpStatus.NOT_FOUND);
        }
        var userInDb = user.get();
        var borrowRequests = userService.getBorrowRequestsReceived(userInDb);
        if (borrowRequests.isEmpty()) {
            return new ResponseEntity<List<BorrowRequestsReceivedResponse>>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<List<BorrowRequestsReceivedResponse>>(borrowRequests, HttpStatus.OK);
    }
    
    @GetMapping("/securityQuestion")
    public ResponseEntity<MessageResponse> getSecurityQuestion(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(new MessageResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        var userOptional = userService.getUserByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse("User not found"), HttpStatus.NOT_FOUND);
        }
        var user = userOptional.get();
        var securityQuestion = userService.getSecurityQuestion(user);
        if (securityQuestion == null) {
            return new ResponseEntity<>(new MessageResponse("No security questions found"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new MessageResponse(securityQuestion), HttpStatus.OK);

    }
    
    @PostMapping("/validateSecurityQuestion")
    public ResponseEntity<MessageResponse> validateSecurityQuestion(@RequestBody ValidateSecurityQuestionRequest validateSecurityQuestionRequest, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(new MessageResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        var userOptional = userService.getUserByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse("User not found"), HttpStatus.NOT_FOUND);
        }
        var user = userOptional.get();
        var isValid = userService.validateSecurityQuestion(user, validateSecurityQuestionRequest.question(), validateSecurityQuestionRequest.answer());
        if (!isValid) {
            return new ResponseEntity<>(new MessageResponse("Validation failed"), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new MessageResponse("Correct Answer"), HttpStatus.OK);
    }
}

