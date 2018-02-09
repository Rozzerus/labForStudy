package com.rozzer.lab.l08;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;

public class JAXBReader {

    private static String fileName = "D:\\study\\lab\\src\\main\\resources\\XMLlab08.xml";

    public static void main(String[] args) {
        try {
            File file = new File(fileName);
            JAXBContext jaxbContext = JAXBContext.newInstance(Bookcase.class);
            Unmarshaller jaxbUnmarshaller = null;
            jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            Bookcase bookcase = (Bookcase) jaxbUnmarshaller.unmarshal(file);
            Bookshelf bookshelf = bookcase.getBookshelfs().iterator().next();
            System.out.println(bookshelf.getNumber());
        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }

}
