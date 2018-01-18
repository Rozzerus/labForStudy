package com.rozzer.lab.l01;

import com.google.common.collect.Lists;
import com.rozzer.lab.l04.ImmutableLab;
import com.rozzer.lab.l04.LabFactory;
import javafx.util.Pair;

import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ManagerData implements LabFactory {

    private final List<Lab> labData = Lists.newArrayList();

    private static ManagerData INSTANCE = new ManagerData();

    private Comparator idComparator = new LabComparatorId();

    private Comparator standardComparator = new LabComparatorStandard();

    private ManagerData() {
    }

    public static ManagerData getInstance() {
        return INSTANCE;
    }

    public Lab addNewExperiment(String className, Number[] array, Number standard, int id) throws NoClassForCreateException {
        try {
            Class<? extends Lab> loadClass = (Class<? extends Lab>) ClassLoader.getSystemClassLoader().loadClass(className);
            Lab instanceLab = (Lab) loadClass.newInstance();
            instanceLab.setArray(array);
            instanceLab.setStandard(standard);
            instanceLab.setId(id);
            labData.add( instanceLab);
            return instanceLab;
        } catch (InstantiationException | IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch (ClassNotFoundException e) {
            throw new NoClassForCreateException("No class:  " + className,e);
        }
    }

    public Lab createInstance(String className) throws NoClassForCreateException {
        try {
            Class<? extends Lab> loadClass = (Class<? extends Lab>) ClassLoader.getSystemClassLoader().loadClass(className);
            Lab instanceLab = (Lab) loadClass.newInstance();
            return instanceLab;
        } catch (InstantiationException | IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch (ClassNotFoundException e) {
            throw new NoClassForCreateException("No class:" + className,e);
        }
    }

    public Collection<Pair<String, String>> getExperiments() {
        Collection<Pair<String, String>> experiments = Lists.newArrayList();

        for (Lab lab:labData) {
            experiments.add(new Pair<String, String>(lab.toString(),lab.getClass().getName()));
        }
        return experiments;
    }

    public Collection<Lab> getLabData() {
        return labData;
    }

    public Collection<Pair<String, String>> getSameExperiments(Lab standardLab){
        Collection<Pair<String, String>> experiments = Lists.newArrayList();

        for (Lab lab:labData) {
            if(standardLab.equals(lab))
                experiments.add(new Pair<String, String>(lab.getDTO().toString(),lab.getClass().getName()));
        }
        return experiments;
    }


    public Collection<Lab> sortFromStandart(){
        Collections.sort(labData, standardComparator);
        return labData;
    }

    public Collection<Lab> sortFromId(){
        Collections.sort(labData, idComparator);
        return labData;
    }

    public static Lab unmodifiable(Lab lab) {
        return new ImmutableLab(lab);
    }

    public Lab synchronizedLab (Lab i){
        return null;
    }


    class LabComparatorId<T extends Lab> implements Comparator<T> {

        @Override
        public int compare(T o1, T o2) {
            return o1.getId()-o2.getId();
        }
    }

    class LabComparatorStandard<T extends Lab> implements Comparator<T> {

        @Override
        public int compare(T o1, T o2) {
            return  o1.getStandard().intValue()-o2.getStandard().intValue();
        }

    }
}
