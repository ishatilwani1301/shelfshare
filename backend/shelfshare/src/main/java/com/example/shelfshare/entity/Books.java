package com.example.shelfshare.entity;

import java.util.List;
import jakarta.persistence.*;



@Entity
public class Books {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookId;

    @Column(nullable = false)
    private String bookTitle;

    @Column(nullable = false)
    private String authorName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private BookGenre bookGenre;
   
    @Column(nullable = false)
    private Integer publicationYear;

    @ManyToOne
    @JoinColumn(name = "current_owner_user_id", nullable = false)
    private Users currentOwner; //to do

    @OneToMany
    private List<Users> previousOwners;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private BookStatus bookStatus;
    private Boolean enlisted;
    
    public Books() {
    }

    public Books(String bookTitle, String authorName, BookGenre bookGenre, Integer publicationYear, Users currentOwner, List<Users> previousOwners, BookStatus bookStatus, Boolean enlisted) {
        this.bookTitle = bookTitle;
        this.authorName = authorName;
        this.bookGenre = bookGenre;
        this.publicationYear = publicationYear;
        this.currentOwner = currentOwner;
        this.previousOwners = previousOwners;
        this.bookStatus = bookStatus;
        this.enlisted=enlisted;
    }

    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public BookGenre getBookGenre() {
        return bookGenre;
    }

    public void setBookGenre(BookGenre bookGenre) {
        this.bookGenre = bookGenre;
    }

    public Integer getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }

    public Users getCurrentOwner() {
        return currentOwner;
    }

    public void setCurrentOwner(Users currentOwner) {
        this.currentOwner = currentOwner;
    }

    public List<Users> getPreviousOwners() {
        return previousOwners;
    }

    public void setPreviousOwners(List<Users> previousOwners) {
        this.previousOwners = previousOwners;
    }

    public BookStatus getBookStatus() {
        return bookStatus;
    }

    public void setBookStatus(BookStatus bookStatus) {
        this.bookStatus = bookStatus;
    }

    public Boolean getEnlisted() {
        return enlisted;
    }

    public void setEnlisted(Boolean enlisted) {
        this.enlisted = enlisted;
    }

    @Override
    public String toString() {
        return "Books{" +
                "bookId=" + bookId +
                ", bookTitle='" + bookTitle + '\'' +
                ", authorName='" + authorName + '\'' +
                ", bookGenre=" + bookGenre +
                ", publicationYear=" + publicationYear +
                ", currentOwner=" + currentOwner +
                ", previousOwners=" + previousOwners +
                ", bookStatus=" + bookStatus +
                ", enlisted=" + enlisted + 
                '}';
    }
    
}
