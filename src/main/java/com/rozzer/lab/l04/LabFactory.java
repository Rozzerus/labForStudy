package com.rozzer.lab.l04;

import com.rozzer.lab.l01.Lab;
import com.rozzer.lab.l01.NoClassForCreateException;

public interface LabFactory {
    Lab createInstance(String className) throws NoClassForCreateException;
}
