package com.rozzer.lab.l01;

import com.google.common.collect.Lists;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.OutputStream;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

public class LabExperimentalDataModel02 implements LabInterface<String> {

    private String[] array;

    private String standard;

    private int id;

    public LabExperimentalDataModel02() {
    }

    public LabExperimentalDataModel02(String[] array, String standard, int id) {
        this.array = array;
        this.standard = standard;
        this.id = id;
    }

    @Override
    public String[] addToArrayAndGet(String nextValue) {
        if (Objects.isNull(array)){
            ArrayList<String> integers = Lists.newArrayList();
            integers.add(nextValue);
            array = integers.toArray(new String[integers.size()]);
            return array;
        }
        array = Lists.asList(nextValue, array).toArray(new String[array.length]);
        return array;
    }

    @Override
    public LabDTO<String> getDTO() {
        Arrays.sort(array);
        String max = array[0];
        String min = array[array.length-1];
        for (String i: array) {
            if (i.equals(standard)){
                return new LabDTO<>(max, min, true);
            }
        }
        return new LabDTO<>(max, min, false);
    }

    @Override
    public LabDTO<String> fitsTheCriteria(String maxValue, String minValue, String standardValue)  {
        if (Objects.isNull(maxValue) && Objects.isNull(minValue) && Objects.isNull(standardValue)){
            throw new NoCriteriaInSearchException();
        }
        LabDTO<String> dto = getDTO();
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

    public String[] getArray() {
        return array;
    }

    public void setArray(String[] array) {
        this.array = array;
    }

    public String getStandard() {
        return standard;
    }

    public void setStandard(String standard) {
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
    public int hashCode() {
        return super.hashCode() + id;
    }

    @Override
    public boolean equals(Object obj) {
        if (Objects.nonNull(obj) && obj.equals(id)){
            return true;
        }
        return super.equals(obj);
    }

    @Override
    public String toString() {
        LabDTO<String> dto = getDTO();
        return "Max value : " + dto.getMax() + "; Min value : " +dto.getMin()+ "; Standard value : " +standard+" Id = "+id+".";
    }
}
