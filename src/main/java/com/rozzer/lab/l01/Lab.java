package com.rozzer.lab.l01;

import java.io.OutputStream;
import java.io.Serializable;
import java.io.Writer;

public interface Lab<T extends Number> extends Serializable, Cloneable, Iterable, Comparable {

    T[] addToArrayAndGet(T nextValue);

    LabDTO<T> getDTO();

    LabDTO<T> fitsTheCriteria(T maxValue, T minValue, T standardValue) throws NoCriteriaInSearchException;

    T[] getArray();

    T getStandard();

    int getId();

    void setArray(T[] array);

    void setStandard(T standard);

    void setId(int id);

    void output(OutputStream out);

    void write(Writer out);

    Class<T> getGenericClass();

    Object clone();

    double getElement(int i);

    void setElement(int current, double val);

    int getSize();
}
