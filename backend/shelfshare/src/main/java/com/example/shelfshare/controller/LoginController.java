package com.example.shelfshare.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shelfshare.entity.Users;
import com.example.shelfshare.model.LoginRequest;
import com.example.shelfshare.model.LoginResponse;
import com.example.shelfshare.service.JWTService;
import com.example.shelfshare.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/login")
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
                new LoginResponse("", "Invalid username or password"),
                HttpStatus.FORBIDDEN);
        }
        var accessToken = jwtService.createAccessToken(maybeAuthenticatedUser.get());
        var refreshToken = jwtService.createRefreshToken(maybeAuthenticatedUser.get());

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        response.addCookie(refreshTokenCookie);
        return new ResponseEntity<LoginResponse>(
            new LoginResponse(accessToken,
            "Successful login, use token for further comms"),
            HttpStatus.CREATED);
    }
    
    
}
