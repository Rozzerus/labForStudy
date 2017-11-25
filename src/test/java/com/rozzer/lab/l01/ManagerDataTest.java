package com.rozzer.lab.l01;

import javafx.util.Pair;
import org.junit.Test;

import java.util.Collection;

import static org.junit.Assert.assertTrue;

public class ManagerDataTest {

    @Test
    public void testManager() throws NoClassForCreateException {
        ManagerData managerData = ManagerData.getInstance();
        Collection<Lab> labData = managerData.getLabData();
        assertTrue(labData.isEmpty());
        managerData.addNewExperiment(LabExperimentalDataModel01.class.getName(), new Integer[]{1,2,3} , 2, 1);
        managerData.addNewExperiment(LabExperimentalDataModel01.class.getName(), new Integer[]{1,2,3} , 4, 2);
        managerData.addNewExperiment(LabExperimentalDataModel01.class.getName(), new Integer[]{1,4,3} , 5, 2);
        managerData.addNewExperiment(LabExperimentalDataModel02.class.getName(), new String[]{"a", "b", "c"} , "a", 3);
        managerData.addNewExperiment(LabExperimentalDataModel02.class.getName(), new String[]{"a", "b", "c"} , "d", 4);
        Collection<Pair<String, String>> experiments = managerData.getExperiments();
        for (Pair<String, String> pair:experiments){
            System.out.println(pair.getKey());
        }

    }

}