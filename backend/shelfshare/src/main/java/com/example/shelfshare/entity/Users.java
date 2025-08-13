package com.example.shelfshare.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;

@Entity
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String name;
    
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordDigest;

    private String userEmail;

    private String pincode;
    private String area;
    private String city;
    private String state;
    private String country;

    private boolean isAdmin;

    @ElementCollection
    @CollectionTable(name = "user_security_questions", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "question_key", nullable = false)
    @Column(name = "answer_value", nullable = false)
    private Map<String, String> securityQuestionMap = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "user_owned_books", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "book_id")
    private List<Integer> bookOwned = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_enlisted_books", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "book_id")
    @Column(name = "ratings")
    private Map<Integer, Integer> booksEnlistedForSale = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "user_received_requests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "borrow_request_id")
    private List<Integer> borrowRequestsReceived = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_sent_requests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "borrow_request_id")
    private List<Integer> borrowRequestsSent = new ArrayList<>();

    public Users() {
    }

    public Users(String name, String username, String passwordDigest, String userEmail, String pincode, String area,
            String city, String state, String country, boolean isAdmin) {
        this.name = name;
        this.username = username;
        this.passwordDigest = passwordDigest;
        this.userEmail = userEmail;
        this.pincode = pincode;
        this.area = area;
        this.city = city;
        this.state = state;
        this.country = country;
        this.isAdmin = isAdmin;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordDigest() {
        return passwordDigest;
    }

    public void setPasswordDigest(String passwordDigest) {
        this.passwordDigest = passwordDigest;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public boolean isIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Map<String, String> getSecurityQuestionMap() {
        return securityQuestionMap;
    }

    public void setSecurityQuestionMap(Map<String, String> securityQuestionMap) {
        this.securityQuestionMap = securityQuestionMap;
    }

    public List<Integer> getBookOwned() {
        return bookOwned;
    }

    public void setBookOwned(List<Integer> bookOwned) {
        this.bookOwned = bookOwned;
    }

    public Map<Integer, Integer> getBooksEnlistedForSale() {
        return booksEnlistedForSale;
    }

    public void setBooksEnlistedForSale(Map<Integer, Integer> booksEnlistedForSale) {
        this.booksEnlistedForSale = booksEnlistedForSale;
    }

    public List<Integer> getBorrowRequestsReceived() {
        return borrowRequestsReceived;
    }

    public void setBorrowRequestsReceived(List<Integer> borrowRequestsReceived) {
        this.borrowRequestsReceived = borrowRequestsReceived;
    }

    public List<Integer> getBorrowRequestsSent() {
        return borrowRequestsSent;
    }

    public void setBorrowRequestsSent(List<Integer> borrowRequestsSent) {
        this.borrowRequestsSent = borrowRequestsSent;
    }
}
