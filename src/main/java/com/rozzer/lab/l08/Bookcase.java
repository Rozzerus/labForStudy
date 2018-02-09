package com.rozzer.lab.l08;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "bookcase")
public class Bookcase {

    private List<Bookshelf> bookshelfs;

    public List<Bookshelf> getBookshelfs() {
        return bookshelfs;
    }

    @XmlElement(name = "bookshelf")
    public void setBookshelfs(List<Bookshelf> bookshelfs) {
        this.bookshelfs = bookshelfs;
    }

}
