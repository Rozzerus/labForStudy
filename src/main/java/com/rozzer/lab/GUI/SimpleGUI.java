package com.rozzer.lab.GUI;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class SimpleGUI extends JFrame {

    private static final SimpleGUI INSTANCE = new SimpleGUI();

    private JButton button = new JButton("Add Data");

    private JLabel label = new JLabel("Input:");

    private JTextField input = new JTextField("", 5);

//    private JTextField input = new JTextField("", 5);

    private JTable table = new JTable();

    String[] columnNames = {"Description Experimental",
            "Class Experiment"};

    public static SimpleGUI getInstance() {
        return INSTANCE;
    }

    private SimpleGUI() throws HeadlessException {
        super("Simple Example");
        this.setBounds(100,100,450,300);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container container = this.getContentPane();
        container.setLayout(new GridLayout(10,20,2,3));

        button.addActionListener(new ButtonEventListener());
        container.add(label);
        Dimension dimension = new Dimension(1, 1);
        dimension.setSize(0.5, 1);
        input.setSize(dimension);
        container.add(input);
        container.add(button);
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

    private class ButtonEventListener implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            String message = "";
            message += "Button was pressed\n";
            JOptionPane.showMessageDialog(null,
                    message,
                    "Output",
                    JOptionPane.PLAIN_MESSAGE);
        }
    }
}
