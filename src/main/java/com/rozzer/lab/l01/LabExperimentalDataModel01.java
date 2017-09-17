package com.rozzer.lab.l01;

import com.google.common.collect.Lists;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

public class LabExperimentalDataModel01 implements LabInterface<Integer> {

    private Integer[] array;

    private Integer standard;

    private int anInt;

    public LabExperimentalDataModel01() {
    }

    public LabExperimentalDataModel01(Integer[] array, Integer standard, int anInt) {
        this.array = array;
        this.standard = standard;
        this.anInt = anInt;
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
    public LabDTO<Integer> fitsTheCriteria(Integer maxValue, Integer minValue, Integer standardValue) throws NoCriteriaInSearchException {
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

    public int getAnInt() {
        return anInt;
    }

    public void setAnInt(int anInt) {
        this.anInt = anInt;
    }

    @Override
    public int hashCode() {
        return super.hashCode() + anInt;
    }

    @Override
    public boolean equals(Object obj) {
        if (Objects.nonNull(obj) && obj.equals(anInt)){
            return true;
        }
        return super.equals(obj);
    }

    @Override
    public String toString() {
        LabDTO<Integer> dto = getDTO();
        return "Max value : " + dto.getMax() + "; Min value : " +dto.getMin()+ "; Standard value : " +standard+".";
    }
}