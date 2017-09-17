package com.rozzer.lab.GUI;

import javax.swing.*;
import java.awt.*;

public class SimpleGUI extends JFrame {

    private static final SimpleGUI INSTANCE = new SimpleGUI();


    public static SimpleGUI getInstance() {
        return INSTANCE;
    }

    private SimpleGUI() throws HeadlessException {
        super("Simple Example");
        this.setBounds(100,100,450,300);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    private SimpleGUI(GraphicsConfiguration gc) {
        super(gc);
    }

    private SimpleGUI(String title) throws HeadlessException {
        super(title);
    }

    private SimpleGUI(String title, GraphicsConfiguration gc) {
        super(title, gc);
    }
}
