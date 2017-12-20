package com.rozzer.lab.l04;

import com.rozzer.lab.l01.Lab;
import com.rozzer.lab.l01.LabExperimentalDataModel01;
import com.rozzer.lab.l01.LabExperimentalDataModel02;
import com.rozzer.lab.l01.ManagerData;
import org.junit.Assert;
import org.junit.Test;

import java.util.Iterator;

public class Testl04 {

    @Test
    public  void iteratorTest()  {

        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{5,15,22,88,66}, 15,  1));

        Lab lab = ManagerData.getInstance().getLabData().iterator().next();
        Assert.assertNotNull(lab);

        Iterator iterator = lab.iterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }

        for (Object i : lab) {
            System.out.println(i);
        }

    }


    @Test
    public  void comparatorTest()  {

        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{5,15,22,88,66}, 15,  1));
        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{5,15,22,88,66}, 22,  2));
        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{5,15,22,88,66}, 88,  7));
        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{5,15,22,88,66}, 66,  4));
        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel02(new Double[]{5.6,15.5,22.2,88.5,66.3}, 1.1,  45));
        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{5,15,22,88,66}, 5,  6));
        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{5,15,22,88,66}, 0,  9));

        System.out.println("sort id:");
        ManagerData.getInstance().sortFromId().forEach(lab -> System.out.println(lab));

        System.out.println("sort standard:");
        ManagerData.getInstance().sortFromStandart().forEach(lab -> System.out.println(lab));

    }
}
