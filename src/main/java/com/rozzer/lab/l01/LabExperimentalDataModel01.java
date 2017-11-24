package com.rozzer.lab.l01;

import com.google.common.collect.Lists;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

public class LabExperimentalDataModel01 extends AbstractLab<Integer> {

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
    public Class<Integer> getGenericClass() {
        return Integer.class;
    }

    @Override
    public int hashCode() {
        return super.hashCode() + id;
    }

    @Override
    public boolean equals(Object obj) {
        if (Objects.nonNull(obj) && obj.equals(id)){
            if (obj instanceof  LabInterface){
                if (Arrays.equals(((LabInterface)obj).getArray(),getArray()) && ((LabInterface)obj).getStandard().equals(getStandard())) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public String toString() {
        LabDTO<Integer> dto = getDTO();
        StringBuilder builder = new StringBuilder();
        builder.append("Max value : ").append(dto.getMax()).append("; Min value : ").append(dto.getMin()).append("; Standard value : ").append(standard).append(" Id = ").append(id);
        return  builder.toString();
    }

    String getStringForWrite(){
        return this.getId()+"/"+this.getStandard()+"/" +Arrays.toString(this.getArray()) +"/"+this.getClass().getName()+";"+"\n";
    }

    public Object clone(){
        LabExperimentalDataModel01 model01 = new LabExperimentalDataModel01();
        model01.setStandard(getStandard());
        model01.setArray(getArray().clone());
        model01.setId(getId());
        return model01;
    }
}
