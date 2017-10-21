package com.rozzer.lab.l02;

import com.rozzer.lab.l01.LabInterface;

import java.io.*;
import java.util.ArrayList;

public class InutOutputEngine {


    public static void outputLabInterface(LabInterface o, OutputStream out){
        o.output(out);
    }

    public static LabInterface inputLabInterface(InputStream in) throws IOException {
        ArrayList<byte[]> result = new ArrayList<>();
        try {
            while (in.available() > 0) {
                byte[] buffer = new byte[1000];
                in.read(buffer);
                result.add(buffer);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            in.close();
        }
        return null;
    }

    public static void writeLabInterface (LabInterface o, Writer out){
        o.write(out);
    }

    public static LabInterface readLabInterface(Reader in) throws IOException {
        ArrayList<Integer> result = new ArrayList<>();
        try {
            while (in.ready()) {
                int buffer = in.read();
                result.add(buffer);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            in.close();
        }
        return null;
    }

}
