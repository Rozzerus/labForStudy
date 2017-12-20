package com.rozzer.lab.l01;

import com.google.common.collect.Lists;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.OutputStream;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Objects;

public class LabExperimentalDataModel02 extends AbstractLab<Double> {

    private Double[] array;

    private Double standard;

    private int id;

    public LabExperimentalDataModel02() {
    }

    public LabExperimentalDataModel02(Double[] array, Double standard, int id) {
        this.array = array;
        this.standard = standard;
        this.id = id;
    }

    @Override
    public Double[] addToArrayAndGet(Double nextValue) {
        if (Objects.isNull(array)){
            ArrayList<Double> integers = Lists.newArrayList();
            integers.add(nextValue);
            array = integers.toArray(new Double[integers.size()]);
            return array;
        }
        array = Lists.asList(nextValue, array).toArray(new Double[array.length]);
        return array;
    }

    @Override
    public LabDTO<Double> getDTO() {
        Arrays.sort(array);
        Double max = array[0];
        Double min = array[array.length-1];
        for (Double i: array) {
            if (i.equals(standard)){
                return new LabDTO<>(max, min, true);
            }
        }
        return new LabDTO<>(max, min, false);
    }

    @Override
    public LabDTO<Double> fitsTheCriteria(Double maxValue, Double minValue, Double standardValue)  {
        if (Objects.isNull(maxValue) && Objects.isNull(minValue) && Objects.isNull(standardValue)){
            throw new NoCriteriaInSearchException();
        }
        LabDTO<Double> dto = getDTO();
        if (Objects.nonNull(maxValue) && maxValue.equals(dto.getMax())){
            return dto;
        }
        if (Objects.nonNull(minValue) && minValue.equals(dto.getMin())){
            return dto;
        }
        if (Objects.nonNull(standardValue) && standardValue.equals(standard)){
            return dto;
        }
        return null;
    }

    public Double[] getArray() {
        return array;
    }

    public void setArray(Double[] array) {
        this.array = array;
    }

    public Double getStandard() {
        return standard;
    }

    public void setStandard(Double standard) {
        this.standard = standard;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public void output(OutputStream out) {
        throw new NotImplementedException();

    }

    @Override
    public void write(Writer out) {
        throw new NotImplementedException();

    }

    @Override
    String getStringForWrite() {
        return this.getId()+"/"+this.getStandard()+"/" +Arrays.toString(this.getArray()) +"/"+this.getClass().getName()+";"+"\n";
    }

    @Override
    public Class<Double> getGenericClass() {
        return Double.class;
    }

    @Override
    public int hashCode() {
        return super.hashCode() + id;
    }

    @Override
    public boolean equals(Object obj) {
        if (Objects.nonNull(obj) && obj.equals(id)){
            if (obj instanceof Lab){
                if (Arrays.equals(((Lab)obj).getArray(),getArray()) && ((Lab)obj).getStandard().equals(getStandard())) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public String toString() {
        LabDTO<Double> dto = getDTO();
        StringBuilder builder = new StringBuilder();
        builder.append("Max value : ").append(dto.getMax()).append("; Min value : ").append(dto.getMin()).append("; Standard value : ").append(standard).append(" Id = ").append(id);
        return  builder.toString();
    }

    public Object clone(){
        LabExperimentalDataModel02 model02 = new LabExperimentalDataModel02();
        model02.setStandard(getStandard());
        model02.setArray(getArray().clone());
        model02.setId(getId());
        return model02;
    }

    @Override
    public double getElement(int i) {
        return 0;
    }

    @Override
    public void setElement(int current, double val) {

    }

    @Override
    public int getSize() {
        return 0;
    }

    @Override
    public Iterator iterator() {
        return new LabIterator<>(array);
    }

    @Override
    public int compareTo(Object o) {
        return comparing(this.hashCode(), o.hashCode());
    }
}
