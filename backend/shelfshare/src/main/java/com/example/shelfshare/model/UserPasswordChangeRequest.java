package com.example.shelfshare.model;

public record UserPasswordChangeRequest(String oldPassword, String newPassword) {};