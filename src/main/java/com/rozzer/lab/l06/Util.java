package com.rozzer.lab.l06;

import java.io.Closeable;
import java.io.IOException;
import java.util.Objects;

public class Util {
    public static void closing(Closeable closeable){
        if (Objects.nonNull(closeable)) {
            try {
                closeable.close();
            } catch (IOException e) {
                System.out.println("Error for close");
                e.printStackTrace();
            }
        }
    }
}
