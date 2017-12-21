package com.rozzer.lab.l05;

import com.rozzer.lab.l01.Lab;
import com.rozzer.lab.l01.LabDTO;
import com.rozzer.lab.l01.NoCriteriaInSearchException;

import java.io.OutputStream;
import java.io.Writer;
import java.util.Iterator;

public class LabSync<T extends Number> implements Lab<T> {

    private Lab<T> lab;

    public LabSync(Lab<T> lab) {
        this.lab = lab;
    }

    @Override
    public T[] addToArrayAndGet(T nextValue) {
        synchronized(lab) {
            return lab.getArray();
        }
    }

    @Override
    public LabDTO<T> getDTO() {
        synchronized(lab) {
            return lab.getDTO();
        }
    }

    @Override
    public LabDTO<T> fitsTheCriteria(T maxValue, T minValue, T standardValue) throws NoCriteriaInSearchException {
        synchronized(lab) {
            return lab.fitsTheCriteria(maxValue, minValue, standardValue);
        }
    }

    @Override
    public T[] getArray() {
        synchronized(lab) {
            return lab.getArray();
        }
    }

    @Override
    public T getStandard() {
        synchronized(lab) {
            return lab.getStandard();
        }
    }

    @Override
    public int getId() {
        synchronized(lab) {
            return lab.getId();
        }
    }

    @Override
    public void setArray(T[] array) {
        synchronized(lab) {
            lab.setArray(array);
        }
    }

    @Override
    public void setStandard(T standard) {
        synchronized(lab) {
            lab.setStandard(standard);
        }
    }

    @Override
    public void setId(int id) {
        synchronized(lab) {
            lab.setId(id);
        }
    }

    @Override
    public void output(OutputStream out) {
        synchronized(lab) {
            lab.output(out);
        }
    }

    @Override
    public void write(Writer out) {
        synchronized(lab) {
            lab.write(out);
        }
    }

    @Override
    public Class<T> getGenericClass() {
        synchronized(lab) {
            return lab.getGenericClass();
        }
    }

    @Override
    public Object clone() {
        synchronized(lab) {
            return lab.clone();
        }
    }

    @Override
    public Number getElement(int i) {
        synchronized(lab) {
            return lab.getElement(i);
        }
    }

    @Override
    public void setElement(int current, Number val) {
        synchronized(lab) {
            lab.setElement(current, val);
        }
    }

    @Override
    public int getSize() {
        synchronized(lab) {
            return lab.getSize();
        }
    }

    @Override
    public int compareTo(Object o) {
        synchronized(lab) {
            return lab.compareTo(o);
        }
    }

    @Override
    public Iterator iterator() {
        synchronized(lab) {
            return lab.iterator();
        }
    }
}
