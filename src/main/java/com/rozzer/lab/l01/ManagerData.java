package com.rozzer.lab.l01;

import com.google.common.collect.Lists;
import com.rozzer.lab.l04.ImmutableLab;
import com.rozzer.lab.l04.LabFactory;
import javafx.util.Pair;

import java.util.Collection;

public class ManagerData implements LabFactory {

    private final Collection<Lab> labData = Lists.newArrayList();

    private static ManagerData INSTANCE = new ManagerData();

    private ManagerData() {
    }

    public static ManagerData getInstance() {
        return INSTANCE;
    }

    public Lab addNewExperiment(String className, Object[] array, Object standard, int id) throws NoClassForCreateException {
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
            throw new NoClassForCreateException("No class:" + className,e);
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

    public static Lab unmodifiable(Lab lab) {
        return new ImmutableLab(lab);
    }

    public Lab synchronizedLab (Lab i){
        return null;
    }
}
