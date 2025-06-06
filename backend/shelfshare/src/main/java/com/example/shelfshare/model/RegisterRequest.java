package com.example.shelfshare.model;

import java.util.Map;

public record RegisterRequest(String name, String username, String password, String email, String pincode, String area, String city, String state, String country, Map<String, String> securityQuestionAnswers) {};