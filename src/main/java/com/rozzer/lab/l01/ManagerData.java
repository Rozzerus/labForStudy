package com.rozzer.lab.l01;

import com.google.common.collect.Lists;
import javafx.util.Pair;

import java.util.Collection;

public class ManagerData {

    private final Collection<LabInterface> labData = Lists.newArrayList();

    private static ManagerData INSTANCE = new ManagerData();

    private ManagerData() {
    }

    public static ManagerData getInstance() {
        return INSTANCE;
    }

    public void addNewExperiment(String className, Object[] array, Object standard, int id) throws NoClassForCreateException {
        try {
            Class<? extends LabInterface> loadClass = (Class<? extends LabInterface>) ClassLoader.getSystemClassLoader().loadClass(className);
            LabInterface instanceLab = (LabInterface) loadClass.newInstance();
            instanceLab.setArray(array);
            instanceLab.setStandard(standard);
            instanceLab.setId(id);
            labData.add( instanceLab);
        } catch (InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            throw new NoClassForCreateException("No class:" + className,e);
        }

    }

    public Collection<Pair<String, String>> getExperiments() {
        Collection<Pair<String, String>> experiments = Lists.newArrayList();

        for (LabInterface lab:labData) {
            experiments.add(new Pair<String, String>(lab.toString(),lab.getClass().getName()));
        }
        return experiments;
    }

    public Collection<LabInterface> getLabData() {
        return labData;
    }

    public Collection<Pair<String, String>> getSameExperiments(LabInterface standardLab){
        Collection<Pair<String, String>> experiments = Lists.newArrayList();

        for (LabInterface lab:labData) {
            if(standardLab.equals(lab))
                experiments.add(new Pair<String, String>(lab.getDTO().toString(),lab.getClass().getName()));
        }
        return experiments;
    }
}
