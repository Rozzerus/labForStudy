package com.rozzer.lab.GUI;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class SimpleGUI extends JFrame {

    private static final SimpleGUI INSTANCE = new SimpleGUI();

    private JButton button = new JButton("Add Data");

    private JButton guessButton = new JButton("Guess");

    private JLabel label = new JLabel("Input:");

    private JLabel result = new JLabel("Success");

    private JLabel size = new JLabel("");

    private JLabel minLabel = new JLabel("Min:");

    private JLabel maxLable = new JLabel("Max:");

    private JTextField input = new JTextField("", 5);

    private JTextField minInput = new JTextField("", 5);

    private JTextField maxInput = new JTextField("", 5);
//    private JTextField input = new JTextField("", 5);

    private int random_number;

    private JTable table = new JTable();

    String[] columnNames = {"Description Experimental",
            "Class Experiment"};

    public static SimpleGUI getInstance() {
        return INSTANCE;
    }

    private SimpleGUI() throws HeadlessException {
        super("Simple Example");
        this.setBounds(100,100,450,400);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container container = this.getContentPane();
        container.setLayout(new GridLayout(10,20,2,3));
        Dimension dimension = new Dimension(1, 1);
        dimension.setSize(0.5, 1);

        button.addActionListener(new ButtonEventListener());

        guessButton.addActionListener(new GButtonEventListener());

        container.add(minLabel);
        minInput.setSize(dimension);
        container.add(minInput);

        container.add(maxLable);
        minInput.setSize(dimension);
        container.add(maxInput);



        container.add(button);

        container.add(size);

        container.add(label);
        input.setSize(dimension);
        container.add(input);

        container.add(guessButton);
        guessButton.setVisible(false);
        label.setVisible(false);
        input.setVisible(false);
        result.setVisible(false);

        container.add(result);


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
            String minInputText = minInput.getText();
            String maxInputText = maxInput.getText();
            size.setText(minInputText +"-"+ maxInputText);
            guessButton.setVisible(true);
            label.setVisible(true);
            input.setVisible(true);
            random_number = Integer.parseInt(minInputText) + (int) (Math.random() * Integer.parseInt(maxInputText));
            result.setVisible(false);
        }
    }

    private class GButtonEventListener implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            if (random_number == Integer.parseInt(input.getText())){
                result.setText("Success");
            } else {
                result.setText("Fail");
            }
            result.setVisible(true);
        }
    }
}
