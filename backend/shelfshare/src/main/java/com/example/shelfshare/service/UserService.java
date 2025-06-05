package com.example.shelfshare.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.shelfshare.entity.Users;
import com.example.shelfshare.model.UserAddressResponse;
import com.example.shelfshare.model.UserDetailsChangeRequest;
import com.example.shelfshare.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private PasswordEncoder encoder;

    @Autowired
    private final RestTemplate restTemplate;

    public UserService(RestTemplate restTemplate) {
        this.encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        this.restTemplate = restTemplate;
    }

    public Optional<Users> createUser(String name, String username, String password, String email, String pincode, String area, String city, String state, String country, Map<String, String> securityQuestionAnswers) {
        if (userRepository.findByUsername(username).isPresent()) {
            return Optional.empty();
        }
        var user = new Users();
        user.setName(name);
        user.setUsername(username);
        user.setPasswordDigest(encoder.encode(password));
        user.setUserEmail(email);
        user.setPincode(pincode);
        user.setArea(area);
        user.setCity(city);
        user.setState(state);
        user.setCountry(country);
        user.setSecurityQuestionMap(securityQuestionAnswers);
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

    public UserAddressResponse getAddressByPincode(String pincode) {
        if (pincode == null || pincode.isEmpty()) {
            return new UserAddressResponse(Collections.emptyList(), null, null, null, "Pincode cannot be null or empty");
        }

        String url = "http://www.postalpincode.in/api/pincode/" + pincode;

        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);

            if (response == null || "Error".equalsIgnoreCase(response.path("Status").asText())) {
                return new UserAddressResponse(Collections.emptyList(), null, null, null, "No response from the API");
            }

            String status = response.path("Status").asText();
            String message = response.path("Message").asText();

            if ("Success".equalsIgnoreCase(status)) {
                JsonNode postOfficeArray = response.path("PostOffice");

                if (postOfficeArray.isArray() && !postOfficeArray.isEmpty()) {
                    JsonNode firstPostOffice = postOfficeArray.get(0);
                    String city = firstPostOffice.path("District").asText();
                    String state = firstPostOffice.path("State").asText();
                    String country = firstPostOffice.path("Country").asText();

                    List<String> allAreaNames = new ArrayList<>();
                    for (JsonNode postOffice : postOfficeArray) {
                        allAreaNames.add(postOffice.path("Name").asText());
                    }

                    return new UserAddressResponse(allAreaNames, city, state, country, message);
                }
            }

            return new UserAddressResponse(Collections.emptyList(), null, null, null, message);

        } catch (Exception e) {
            return new UserAddressResponse(Collections.emptyList(), null, null, null, "An internal error occurred while processing the request.");
        }
    }
}
