package com.rozzer.lab.l08;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class Bookcase {

    @XmlElementWrapper(name = "bookshelves")
    @XmlElement(name = "bookshelf")
    private List<Bookshelf> bookshelf;

    public List<Bookshelf> getBookshelf() {
        return bookshelf;
    }

    public void setBookshelf(List<Bookshelf> bookshelf) {
        this.bookshelf = bookshelf;
    }
}
