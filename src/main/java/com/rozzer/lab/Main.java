package com.rozzer.lab;

import com.rozzer.lab.GUI.SimpleGUI;
import com.rozzer.lab.l01.ManagerData;
import javafx.util.Pair;

import java.util.Collection;

public class Main {


    public static void main(String[] args) {
        SimpleGUI app = SimpleGUI.getInstance();
        app.setVisible(true);

    }

    public static Collection<Pair<String, String>> getExperiments() {
        return ManagerData.getInstance().getExperiments();
    }

}
