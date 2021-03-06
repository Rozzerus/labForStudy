package com.rozzer.lab.l08;

import com.rozzer.lab.l08.objects.Bookcase;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;

public class JAXBReader {

    private static JAXBReader INSTANCE = new JAXBReader();

    private JAXBReader() {
    }

    public static JAXBReader getInstance() {
        return INSTANCE;
    }

    public Bookcase read(String fileName) {
        try {
            File file = new File(fileName);
            JAXBContext jaxbContext = JAXBContext.newInstance(Bookcase.class);
            Unmarshaller jaxbUnmarshaller;
            jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            return (Bookcase) jaxbUnmarshaller.unmarshal(file);
        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }
    }



}
