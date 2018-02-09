package com.rozzer.lab.l08;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "intro")
public class Intro {

    private int pages;

    public int getPages() {
        return pages;
    }

    @XmlAttribute(name = "pages")
    public void setPages(int pages) {
        this.pages = pages;
    }
}
