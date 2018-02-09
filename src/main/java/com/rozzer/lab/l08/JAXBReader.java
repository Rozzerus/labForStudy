package com.rozzer.lab.l08;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.util.List;

public class JAXBReader {

    private static String fileName = "D:\\study\\lab\\src\\main\\resources\\XMLlab08.xml";

    public static void main(String[] args) {
        try {
            File file = new File(fileName);
            JAXBContext jaxbContext = JAXBContext.newInstance(Bookcase.class);
            Unmarshaller jaxbUnmarshaller = null;
            jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            Bookcase bookcase = (Bookcase) jaxbUnmarshaller.unmarshal(file);
            validatePagesSum(bookcase);
        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    public static void validatePagesSum(Bookcase bookcase){
        bookcase.getBookshelfs().forEach(bookshelf ->
            bookshelf.getBooks().forEach(JAXBReader::validate));
    }

    private static void validate(Book book){
        String sum = String.valueOf(count(book.getChapters(), book.getIntro()));
        Pages bookPages = book.getPages();
        if (bookPages != null) {
            if (sum.equals(bookPages.getValue()))
                bookPages.setValue(sum);
        } else {
            bookPages = new Pages();
            bookPages.setValue(sum);
            book.setPages(bookPages);
        }
    }

    private static int count(List<Chapter> chapters, Intro intro){
        int sum = 0;
        sum+=Integer.valueOf(intro.getPages());
        for (Chapter cur: chapters)
            sum+=Integer.valueOf(cur.getPages());
        return sum;
    }

}
