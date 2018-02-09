package com.rozzer.lab.l08;

import com.rozzer.lab.l08.objects.Bookcase;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;

public class JAXBWriter {

    private static JAXBWriter INSTANCE = new JAXBWriter();

    private JAXBWriter() {
    }

    public static JAXBWriter getInstance() {
        return INSTANCE;
    }

    public Bookcase write(Bookcase bookcase, String fileName){
        try {
            File file = new File(fileName);
            JAXBContext jaxbContext = JAXBContext.newInstance(Bookcase.class);
            Unmarshaller jaxbUnmarshaller = null;
            jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            return (Bookcase) jaxbUnmarshaller.unmarshal(file);
        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }
    }
}
