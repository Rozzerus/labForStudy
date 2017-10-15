package com.rozzer.lab.l02;

import com.rozzer.lab.l01.LabInterface;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.*;

public class InutOutputEngine {

    public static void outputLabInterface(LabInterface o, OutputStream out){
        o.output(out);
    }

    public static LabInterface inputLabInterface(InputStream in){
        throw new NotImplementedException();
    }

    public static void writeLabInterface (LabInterface o, Writer out){
//        new StreamTokenizer().;
        try {
            FileOutputStream fileOutputStream = new FileOutputStream("temp.out");;
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        TestSerial ts = new TestSerial();
        oos.writeObject(ts);
        o.write(out);
        oos.flush();
        oos.close();
    }

    public static LabInterface readLabInterface(Reader in){
        throw new NotImplementedException();
    }

}
