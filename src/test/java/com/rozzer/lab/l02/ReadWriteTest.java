package com.rozzer.lab.l02;

import com.rozzer.lab.l01.LabExperimentalDataModel01;
import org.junit.Test;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class ReadWriteTest {

    private static final String FILE = "d:/data.txt";

    @Test
    public void testRead() throws IOException {
        FileInputStream fileInputStream = new FileInputStream(FILE);
        InutOutputEngine.inputLabInterface(fileInputStream);
    }

    @Test
    public  void testWrite() throws FileNotFoundException {
        FileOutputStream fileOutputStream = new FileOutputStream(FILE);
        LabExperimentalDataModel01 model01 = new LabExperimentalDataModel01(new Integer[]{1, 2, 3}, 2, 55);
        InutOutputEngine.outputLabInterface(model01, fileOutputStream);
    }
}
