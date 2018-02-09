package com.rozzer.lab.l08.objects;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "book")
public class Book {

    private Intro intro;

    private List<Chapter> chapters;

    private Pages pages;


    public Intro getIntro() {
        return intro;
    }

    @XmlElement(name = "intro")
    public void setIntro(Intro intro) {
        this.intro = intro;
    }

    public List<Chapter> getChapters() {
        return chapters;
    }

    @XmlElement(name = "chapter")
    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
    }

    public Pages getPages() {
        return pages;
    }

    @XmlElement(name = "pages")
    public void setPages(Pages pages) {
        this.pages = pages;
    }
}
