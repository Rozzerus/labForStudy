package com.rozzer.lab.l01;

import com.google.common.collect.Lists;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

public class LabExperimentalDataModel01 implements LabInterface<Integer> {

    private Integer[] array;

    private Integer standard;

    private int id;

    public LabExperimentalDataModel01() {
    }

    public LabExperimentalDataModel01(Integer[] array, Integer standard, int id) {
        this.array = array;
        this.standard = standard;
        this.id = id;
    }


    @Override
    public Integer[] addToArrayAndGet(Integer nextValue){
        if (Objects.isNull(array)){
            ArrayList<Integer> integers = Lists.newArrayList();
            integers.add(nextValue);
            array = integers.toArray(new Integer[integers.size()]);
            return array;
        }
        array = Lists.asList(nextValue, array).toArray(new Integer[array.length]);
        return array;
    }

    @Override
    public LabDTO<Integer> getDTO() {
        Arrays.sort(array);
        int max = array[0];
        int min = array[array.length-1];
        for (Integer i: array) {
            if (i.equals(standard)){
                return new LabDTO<>(max, min, true);

            }
        }
        return new LabDTO<>(max, min, false);
    }

    @Override
    public LabDTO<Integer> fitsTheCriteria(Integer maxValue, Integer minValue, Integer standardValue) {
        if (Objects.isNull(maxValue) && Objects.isNull(minValue) && Objects.isNull(standardValue)){
            throw new NoCriteriaInSearchException();
        }
        LabDTO<Integer> dto = getDTO();
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


    public Integer[] getArray() {
        return array;
    }

    public void setArray(Integer[] array) {
        this.array = array;
    }

    public Integer getStandard() {
        return standard;
    }

    public void setStandard(Integer standard) {
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
        InputStream inputStream = new ByteArrayInputStream(this.toString().getBytes());
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
        char[] charArray = this.toString().toCharArray();
        try {
            for (char symbol: charArray){
                out.write(symbol);
            }
            out.write(this.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
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
        LabDTO<Integer> dto = getDTO();
        return "Max value : " + dto.getMax() + "; Min value : " +dto.getMin()+ "; Standard value : " +standard+" Id = "+id+".";
    }
}
