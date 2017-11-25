package com.rozzer.lab.l01;

import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.*;
import java.lang.reflect.Array;
import java.util.Iterator;
import java.util.function.Consumer;

public abstract class AbstractLab<T> implements Lab<T> {

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

    final class LabIterator implements Iterator<T> {
        private Object array;
        private int currentIndex = 0;

        @Override
        public boolean hasNext() {
            return currentIndex < Array.getLength(array);
        }

        public final T next() {
            return (T) Array.get(array, currentIndex++);
        }

        @Override
        public void remove() {
            throw new UnsupportedOperationException("cannot remove items from an array");
        }

        @Override
        public void forEachRemaining(Consumer<? super T> action) {

        }
    }

    public static int compare(int x, int y) {
        return (x < y) ? -1 : ((x == y) ? 0 : 1);
    }

}
