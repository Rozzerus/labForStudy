package com.rozzer.lab.l02;

import com.rozzer.lab.l01.LabExperimentalDataModel01;
import com.rozzer.lab.l01.LabInterface;
import com.rozzer.lab.l01.NoClassForCreateException;
import org.junit.Test;

import java.io.*;

public class ReadWriteTest {

    private static final String FILE = "d:/data.txt";

    @Test
    public  void testWriteBytes() throws FileNotFoundException {
        FileOutputStream fileOutputStream = new FileOutputStream(FILE,true);
        LabExperimentalDataModel01 model01 = new LabExperimentalDataModel01(new Integer[]{1, 2, 3}, 2, 55);
        InputOutputEngine.outputLabInterface(model01, fileOutputStream);
    }

    @Test
    public void testReadBytes() throws IOException, NoClassForCreateException {
        FileInputStream fileInputStream = new FileInputStream(FILE);
        LabInterface labInterface = InputOutputEngine.inputLabInterface(fileInputStream);
        System.out.println(labInterface);
    }


    @Test
    public  void testWriteString() throws IOException {
        Writer fileOutputStream = new FileWriter(FILE,true);
        LabExperimentalDataModel01 model01 = new LabExperimentalDataModel01(new Integer[]{1, 2, 3}, 2, 55);
        InputOutputEngine.writeLabInterface(model01, fileOutputStream);
    }

    @Test
    public  void testReadString() throws IOException {
        FileReader fileInputStream = new FileReader(FILE);
        InputOutputEngine.readLabInterface(fileInputStream);
    }
}
