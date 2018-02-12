package com.rozzer.lab.l08;

import com.rozzer.lab.l08.objects.Bookcase;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

public class JAXBWriter {

    private static JAXBWriter INSTANCE = new JAXBWriter();

    private JAXBWriter() {
    }

    public static JAXBWriter getInstance() {
        return INSTANCE;
    }

    public Bookcase write(Bookcase bookcase, String fileName){
        try{
            JAXBContext jc = JAXBContext.newInstance(Bookcase.class);
            Marshaller m = jc.createMarshaller();
            OutputStream os = new FileOutputStream(fileName);
            m.marshal(bookcase, os);
            os.close();
        }
        catch (JAXBException | IOException e) {
            e.printStackTrace();
        }
        return bookcase;
    }
}
