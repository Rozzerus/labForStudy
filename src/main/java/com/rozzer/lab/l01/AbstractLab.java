package com.rozzer.lab.l01;

import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.*;

public abstract class AbstractLab<T> implements LabInterface<T> {

    @Override
    public void output(OutputStream out) {
        InputStream inputStream = new ByteArrayInputStream(getStringForWrite().getBytes());
        byte[] buffer = new byte[1000];
        try {
            while (inputStream.available() > 0)
            {
                int count = inputStream.read(buffer);
                out.write(buffer, 0, count);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void write(Writer out) {
        try {
            out.write(getStringForWrite());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Object clone() {
        throw new NotImplementedException();
    }

    abstract String getStringForWrite();
}
