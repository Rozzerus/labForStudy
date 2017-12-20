package com.rozzer.lab.l04;

import com.rozzer.lab.l01.Lab;
import com.rozzer.lab.l01.LabDTO;
import com.rozzer.lab.l01.NoCriteriaInSearchException;

import java.io.OutputStream;
import java.io.Writer;
import java.util.Iterator;

public class ImmutableLab<T> implements Lab<T> {

    private Lab<T> lab;

    public ImmutableLab(Lab<T> lab) {
        this.lab = lab;
    }

    @Override
    public T[] addToArrayAndGet(T nextValue)  throws UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    @Override
    public LabDTO<T> getDTO() {
        return lab.getDTO();
    }

    @Override
    public LabDTO<T> fitsTheCriteria(T maxValue, T minValue, T standardValue) throws NoCriteriaInSearchException {
        return lab.fitsTheCriteria(maxValue, minValue, standardValue);
    }

    @Override
    public T[] getArray() {
        return lab.getArray();
    }

    @Override
    public T getStandard() {
        return lab.getStandard();
    }

    @Override
    public int getId() {
        return lab.getId();
    }

    @Override
    public void setArray(T[] array) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void setStandard(T standard) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void setId(int id) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void output(OutputStream out) {
        lab.output(out);
    }

    @Override
    public void write(Writer out) {
        lab.write(out);
    }

    @Override
    public Class<T> getGenericClass() {
        return lab.getGenericClass();
    }

    @Override
    public Object clone() {
        return lab.clone();
    }

    @Override
    public double getElement(int i) {
        return lab.getElement(i);
    }

    @Override
    public void setElement(int current, double val) {
        throw new UnsupportedOperationException();
    }

    @Override
    public int getSize() {
        return lab.getSize();
    }

    @Override
    public int compareTo(Object o) {
        return lab.compareTo(o);
    }

    @Override
    public Iterator iterator() {
        return lab.iterator();
    }
}
