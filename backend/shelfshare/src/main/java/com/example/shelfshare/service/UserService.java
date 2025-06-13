package com.example.shelfshare.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

import com.example.shelfshare.entity.BorrowRequests;
import com.example.shelfshare.entity.Users;
import com.example.shelfshare.model.BorrowRequestsReceivedResponse;
import com.example.shelfshare.model.BorrowRequestsSentResponse;
import com.example.shelfshare.model.UserAddressResponse;
import com.example.shelfshare.model.UserDetailsChangeRequest;
import com.example.shelfshare.repository.BorrowRequestRepository;
import com.example.shelfshare.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;

@Service
@CrossOrigin(origins = "http://localhost:5173")
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private PasswordEncoder encoder;

    @Autowired
    private final RestTemplate restTemplate;

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

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
        if (user == null || request == null) {
            return false;
        }
        if (request.name() != null && !request.name().isEmpty()) {
            user.setName(request.name());
        }
        if (request.email() != null && !request.email().isEmpty()) {
            user.setUserEmail(request.email());
        }
        if (request.pincode() != null && !request.pincode().isEmpty()) {
            user.setPincode(request.pincode());
        }
        if (request.area() != null && !request.area().isEmpty()) {
            user.setArea(request.area());
        }
        if (request.city() != null && !request.city().isEmpty()) {
            user.setCity(request.city());
        }
        if (request.state() != null && !request.state().isEmpty()) {
            user.setState(request.state());
        }
        if (request.country() != null && !request.country().isEmpty()) {
            user.setCountry(request.country());
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

    public List<BorrowRequestsSentResponse> getBorrowRequestsSent(Users user) {
        if (user == null) {
            return Collections.emptyList();
        }
        
        List<BorrowRequestsSentResponse> borrowRequests = new ArrayList<>();
        List<BorrowRequests> requests = borrowRequestRepository.findAllByRequesterId(user.getUserId());
        for (BorrowRequests request : requests) {
            borrowRequests.add(new BorrowRequestsSentResponse(request.getBook().getBookTitle(),
                                                            request.getBook().getAuthorName(),
                                                            request.getRequestDate().toString(),
                                                            request.getOwner().getUsername(),
                                                            request.getStatus().toString()));
        }
        return borrowRequests;
    }

    public List<BorrowRequestsReceivedResponse> getBorrowRequestsReceived(Users user) {
        if (user == null) {
            return Collections.emptyList();
        }
        
        List<BorrowRequestsReceivedResponse> borrowRequests = new ArrayList<>();
        List<BorrowRequests> requests = borrowRequestRepository.findAllByBorrowerId(user.getUserId());
        for (BorrowRequests request : requests) {
            var book = request.getBook();
            var requester = request.getRequester();
            borrowRequests.add(new BorrowRequestsReceivedResponse(
                book.getBookId(),
                book.getBookTitle(),
                book.getAuthorName(),
                requester.getUserId(),
                requester.getName(),
                requester.getUsername(),
                requester.getUserEmail(),
                requester.getPincode(),
                requester.getArea(),
                requester.getCity(),
                requester.getState(),
                requester.getCountry(),
                request.getRequestDate().toString()
            ));
        }
        return borrowRequests;
    }

    public String getSecurityQuestion(Users user) {
        var securityQuestionsMap = user.getSecurityQuestionMap();
        if (securityQuestionsMap == null || securityQuestionsMap.isEmpty()) {
            return null;
        }
        List<String> questions = new ArrayList<>(securityQuestionsMap.keySet());
        Random random = new Random();
        int randomIndex = random.nextInt(questions.size());
        return questions.get(randomIndex);
    }

    public Boolean validateSecurityQuestion(Users user, String question, String answer) {
        Map<String, String> securityQuestionsMap = user.getSecurityQuestionMap();
        if (securityQuestionsMap == null || !securityQuestionsMap.containsKey(question)) {
            return false;
        }
        return answer.equals(securityQuestionsMap.get(question));
    }
}
