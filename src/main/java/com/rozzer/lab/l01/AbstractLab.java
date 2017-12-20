package com.rozzer.lab.l01;

import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.*;
import java.lang.reflect.Array;
import java.util.Iterator;
import java.util.function.Consumer;

public abstract class AbstractLab<T extends Number> implements Lab<T> {

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

    class LabIterator<T> implements Iterator<T> {
        private T[] array;
        private int currentIndex;

        public LabIterator(T[] array) {
            this.array = array;
            this.currentIndex =0;
        }

        @Override
        public boolean hasNext() {
            return currentIndex < Array.getLength(array);
        }

        public final T next() {
            return (T) Array.get(array, this.currentIndex++);
        }

        @Override
        public void remove() {
            throw new UnsupportedOperationException("cannot remove items from an array");
        }

        @Override
        public void forEachRemaining(Consumer<? super T> action) {

        }
    }


    @Override
    public int compareTo(Object o) {
        if (o instanceof Lab){
            return comparing(this.hashCode(), o.hashCode());
        }
        return 0;
    }

    public int comparing(int x, int y) {
        return (x < y) ? -1 : ((x == y) ? 0 : 1);
    }


}
