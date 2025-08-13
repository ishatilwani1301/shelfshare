package com.example.shelfshare.entity;

import jakarta.persistence.*;

@Entity
public class Reviews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private int ratings;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Books book;

    public Reviews() {}

    public Reviews(Integer id, int ratings, Users user, Books book) {
        this.id = id;
        this.ratings = ratings;
        this.user = user;
        this.book = book;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public int getRatings() { return ratings; }
    public void setRatings(int ratings) { this.ratings = ratings; }

    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }

    public Books getBook() { return book; }
    public void setBook(Books book) { this.book = book; }
}
