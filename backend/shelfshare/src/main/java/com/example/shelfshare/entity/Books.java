package com.example.shelfshare.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

enum BookStatus {
    AVAILABLE,
    BORROWED,
    LOST,
    ARCHIVED
}

enum BookGenre {
    FICTION,
    NON_FICTION,
    SCIENCE,
    HISTORY,
    FANTASY,
    MYSTERY,
    BIOGRAPHY,
    ROMANCE
}

@Entity
public class Books {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookId;

    private String bookTitle;

    private String authorName;

    private BookGenre bookGenre;

    private Integer publicationYear;

    @OneToOne
    private Users currentOwner;

    @OneToMany
    private List<Users> previousOwners;

    private BookStatus bookStatus;

    public Books() {
    }

    public Books(String bookTitle, String authorName, BookGenre bookGenre, Integer publicationYear, Users currentOwner, List<Users> previousOwners, BookStatus bookStatus) {
        this.bookTitle = bookTitle;
        this.authorName = authorName;
        this.bookGenre = bookGenre;
        this.publicationYear = publicationYear;
        this.currentOwner = currentOwner;
        this.previousOwners = previousOwners;
        this.bookStatus = bookStatus;
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

    @Override
    public String toString() {
        return "Books{" +
                "bookId=" + bookId +
                ", bookTitle='" + bookTitle + '\'' +
                ", authorName='" + authorName + '\'' +
                // ", bookGenre=" + bookGenre +
                ", publicationYear=" + publicationYear +
                ", currentOwner=" + currentOwner +
                ", previousOwners=" + previousOwners +
                // ", bookStatus=" + bookStatus +
                '}';
    }
    
}
