package com.example.shelfshare.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Notes {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer noteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Books book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String noteContent;

    @Column(nullable = false)
    private Instant timestamp;

    private String customizedTitle;

    public Notes() {
    }

    public Notes(Integer noteId, Books book, Users user, String noteContent, Instant timestamp,
            String customizedTitle) {
        this.noteId = noteId;
        this.book = book;
        this.user = user;
        this.noteContent = noteContent;
        this.timestamp = timestamp;
        this.customizedTitle = customizedTitle;
    }

    public Integer getNoteId() {
        return noteId;
    }

    public void setNoteId(Integer noteId) {
        this.noteId = noteId;
    }

    public Books getBook() {
        return book;
    }

    public void setBook(Books book) {
        this.book = book;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public String getNoteContent() {
        return noteContent;
    }

    public void setNoteContent(String noteContent) {
        this.noteContent = noteContent;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getCustomizedTitle() {
        return customizedTitle;
    }

    public void setCustomizedTitle(String customizedTitle) {
        this.customizedTitle = customizedTitle;
    }

}
