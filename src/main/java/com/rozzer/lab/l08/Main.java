package com.rozzer.lab.l08;

import com.rozzer.lab.l08.objects.Bookcase;

public class Main {
    private static String fileName = "D:\\study\\lab\\src\\main\\resources\\XMLlab08.xml";

    public static void main(String[] args) {
        Bookcase bookcase = JAXBReader.getInstance().read(fileName);
        JAXBValidator.getInstance().validate(bookcase);
        JAXBWriter.getInstance().write(bookcase, fileName);
    }
}
