package com.rozzer.lab.l09;

import java.io.Serializable;

public class Point implements Serializable{

    private double x;
    private double y;

    public Point() {
    }

    public Point(double x, double y) {

        this.x = x;
        this.y = y;
    }

    public double x() {
        return x;
    }

    public double y() {
        return y;
    }


}
