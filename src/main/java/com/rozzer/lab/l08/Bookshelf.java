package com.rozzer.lab.l08;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import java.util.List;

public class Bookshelf {

    @XmlAttribute
    private int number;

    @XmlElementWrapper(name = "books")
    @XmlElement(name = "book")
    private List<Book> books;

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }
}
