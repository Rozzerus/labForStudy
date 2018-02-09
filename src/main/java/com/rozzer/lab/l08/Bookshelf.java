package com.rozzer.lab.l08;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "bookshelf")
public class Bookshelf {

    private int number;

    private List<Book> books;

    public int getNumber() {
        return number;
    }

    @XmlAttribute(name = "number")
    public void setNumber(int number) {
        this.number = number;
    }

    public List<Book> getBooks() {
        return books;
    }

    @XmlElement(name = "book")
    public void setBooks(List<Book> books) {
        this.books = books;
    }
}
