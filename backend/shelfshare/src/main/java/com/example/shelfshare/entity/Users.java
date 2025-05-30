package com.example.shelfshare.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;
    
    private String username;

    private String passwordDigest;

    private String userEmail;

    private String pincode;

    private boolean isAdmin;

    public Users() {
    }

    public Users(String passwordDigest, String pincode, String userEmail, Integer userId, String username, Boolean isAdmin) {
        this.passwordDigest = passwordDigest;
        this.pincode = pincode;
        this.userEmail = userEmail;
        this.userId = userId;
        this.username = username;
        this.isAdmin = isAdmin;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public String toString() {
        return "Users{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", passwordDigest='" + passwordDigest + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", pincode='" + pincode + '\'' +
                ", isAdmin=" + isAdmin +
                '}';
    }

    
}
