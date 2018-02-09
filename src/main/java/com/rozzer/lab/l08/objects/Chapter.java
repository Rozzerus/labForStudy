package com.rozzer.lab.l08.objects;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "chapter")
public class Chapter {

    private String title;

    private int pages;

    public String getTitle() {
        return title;
    }

    @XmlAttribute
    public void setTitle(String title) {
        this.title = title;
    }

    public int getPages() {
        return pages;
    }

    @XmlAttribute
    public void setPages(int pages) {
        this.pages = pages;
    }
}
