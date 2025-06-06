package com.example.shelfshare.model;

import java.util.List;

public record UserAddressResponse(List<String> area, String city, String state, String country, String message) {};
