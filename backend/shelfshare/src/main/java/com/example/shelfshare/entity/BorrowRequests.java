package com.example.shelfshare.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class BorrowRequests {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer borrowRequestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Books book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private Users requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Users owner;
    
    @Column(nullable = false)
    private Instant requestDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowRequestStatus status;

    public BorrowRequests() {
    }

    public BorrowRequests(Integer borrowRequestId, Books book, Users requester, Users owner, Instant requestDate,
            BorrowRequestStatus status) {
        this.borrowRequestId = borrowRequestId;
        this.book = book;
        this.requester = requester;
        this.owner = owner;
        this.requestDate = requestDate;
        this.status = status;
    }

    public Integer getBorrowRequestId() {
        return borrowRequestId;
    }

    public void setBorrowRequestId(Integer borrowRequestId) {
        this.borrowRequestId = borrowRequestId;
    }

    public Books getBook() {
        return book;
    }

    public void setBook(Books book) {
        this.book = book;
    }

    public Users getRequester() {
        return requester;
    }

    public void setRequester(Users requester) {
        this.requester = requester;
    }

    public Users getOwner() {
        return owner;
    }

    public void setOwner(Users owner) {
        this.owner = owner;
    }

    public Instant getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Instant requestDate) {
        this.requestDate = requestDate;
    }

    public BorrowRequestStatus getStatus() {
        return status;
    }

    public void setStatus(BorrowRequestStatus status) {
        this.status = status;
    }
}
