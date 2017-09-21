package com.rozzer.lab.l01;

public interface LabInterface<T> {

    T[] addToArrayAndGet(T nextValue);

    LabDTO<T> getDTO();

    LabDTO<T> fitsTheCriteria(T maxValue, T minValue, T standardValue) throws NoCriteriaInSearchException;

    void setArray(T[] array);

    void setStandard(T standard);

    void setId(int id);

}
