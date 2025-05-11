package com.example.fsad.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Author is mandatory")
    @Size(max = 255, message = "Author must not exceed 255 characters")
    private String author;

    @NotNull(message = "Available count is mandatory")
    private Integer available;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String imageUrl;

    @Size(max = 255, message = "PDF URL must not exceed 255 characters")
    private String pdfUrl;

    @NotBlank(message = "Genre is mandatory")
    @Size(max = 255, message = "Genre must not exceed 255 characters")
    private String genre;

    // Default constructor
    public Book() {}

    // Parameterized constructor
    public Book(String title, String author, Integer available, String description, String imageUrl, String pdfUrl, String genre) {
        this.title = title;
        this.author = author;
        this.available = available;
        this.description = description;
        this.imageUrl = imageUrl;
        this.pdfUrl = pdfUrl;
        this.genre = genre;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getAvailable() {
        return available;
    }

    public void setAvailable(Integer available) {
        this.available = available;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }
}