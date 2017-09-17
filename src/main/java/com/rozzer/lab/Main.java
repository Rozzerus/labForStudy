package com.rozzer.lab;

import com.google.common.collect.Sets;
import com.rozzer.lab.GUI.SimpleGUI;
import com.rozzer.lab.l01.LabInterface;
import javafx.util.Pair;

import java.util.Collection;

public class Main {

    private static final Collection<Pair<String, String>> experiments = Sets.newHashSet();
    private static final Collection<LabInterface> labData = Sets.newHashSet();



    public static void main(String[] args) {
        SimpleGUI app = SimpleGUI.getInstance();
        app.setVisible(true);

    }

    public static Collection<Pair<String, String>> getExperiments() {
        return experiments;
    }

    public static Collection<LabInterface> getLabData() {
        return labData;
    }
}
