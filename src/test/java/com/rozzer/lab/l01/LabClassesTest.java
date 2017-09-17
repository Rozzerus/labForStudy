package com.rozzer.lab.l01;

import org.junit.Test;

import static org.junit.Assert.*;

public class LabClassesTest {

    @Test
    public void testForClass01(){
        Integer i1 = 1;
        Integer i2 = 2;
        Integer i3 = 3;
        LabExperimentalDataModel01 labExperimentalDataModel0101 = new LabExperimentalDataModel01();
        Integer[] integers = labExperimentalDataModel0101.addToArrayAndGet(i1);
        assertEquals(i1,integers[0]);
        integers = labExperimentalDataModel0101.addToArrayAndGet(i2);
        assertEquals(i2,integers[0]);
        integers = labExperimentalDataModel0101.addToArrayAndGet(i3);
        assertEquals(i3,integers[0]);
        labExperimentalDataModel0101.setStandard(4);
        assertFalse(labExperimentalDataModel0101.getDTO().isHaveStandard());
        labExperimentalDataModel0101.setStandard(2);
        assertTrue(labExperimentalDataModel0101.getDTO().isHaveStandard());
    }

    @Test
    public void testForClass02(){
        String s1 = "aa";
        String s2 = "bb";
        String s3 = "ab";
        LabExperimentalDataModel02 labExperimentalDataModel02 = new LabExperimentalDataModel02();
        String[] strings = labExperimentalDataModel02.addToArrayAndGet(s1);
        assertEquals(s1,strings[0]);
        strings = labExperimentalDataModel02.addToArrayAndGet(s2);
        assertEquals(s2,strings[0]);
        strings = labExperimentalDataModel02.addToArrayAndGet(s3);
        assertEquals(s3,strings[0]);
        labExperimentalDataModel02.setStandard("cc");
        assertFalse(labExperimentalDataModel02.getDTO().isHaveStandard());
        labExperimentalDataModel02.setStandard("aa");
        assertTrue(labExperimentalDataModel02.getDTO().isHaveStandard());
    }

}