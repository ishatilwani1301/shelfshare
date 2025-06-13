package com.example.shelfshare.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shelfshare.entity.Users;
import com.example.shelfshare.model.LoginRequest;
import com.example.shelfshare.model.LoginResponse;
import com.example.shelfshare.model.MessageResponse;
import com.example.shelfshare.model.ValidateSecurityQuestionRequest;
import com.example.shelfshare.service.JWTService;
import com.example.shelfshare.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    @Autowired
    private JWTService jwtService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/userLogin")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        Optional<Users> maybeAuthenticatedUser = userService.getAuthenticatedUser(req.username(), req.password());
        if (maybeAuthenticatedUser.isEmpty()) {
            return new ResponseEntity<LoginResponse>(
                new LoginResponse("", "Invalid username or password", ""),
                HttpStatus.FORBIDDEN);
        }
        var accessToken = jwtService.createAccessToken(maybeAuthenticatedUser.get());
        var refreshToken = jwtService.createRefreshToken(maybeAuthenticatedUser.get());

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        response.addCookie(refreshTokenCookie);
        return new ResponseEntity<LoginResponse>(
            new LoginResponse(accessToken,
            "Successful login, use token for further comms", req.username()),
            HttpStatus.CREATED);
    }
    
    @GetMapping("/securityQuestion/{username}")
    public ResponseEntity<MessageResponse> getSecurityQuestion(@PathVariable String username) {
        if (username == null) {
            return new ResponseEntity<>(new MessageResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        var userOptional = userService.getUserByUsername(username);
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
    public ResponseEntity<MessageResponse> validateSecurityQuestion(@RequestBody ValidateSecurityQuestionRequest validateSecurityQuestionRequest) {
        if (validateSecurityQuestionRequest.username() == null) {
            return new ResponseEntity<>(new MessageResponse("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        var userOptional = userService.getUserByUsername(validateSecurityQuestionRequest.username());
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
