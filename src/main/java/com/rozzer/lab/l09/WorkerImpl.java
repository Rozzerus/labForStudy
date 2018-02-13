package com.rozzer.lab.l09;

import java.rmi.RemoteException;

import static java.lang.Math.*;

public class WorkerImpl implements Worker {

    public double lineLength(Point point1, Point point2) throws RemoteException{
        return sqrt(pow(point1.x() - point2.x(), 2) + pow(point1.y() - point2.y(), 2));
    }
    public double circleLength(Point point1, Point point2) throws RemoteException{
        return 2*lineLength(point1,point2)*PI;
    }
    public  double circleArea(Point point1, Point point2) throws RemoteException{
        return pow(lineLength(point1,point2),2)*PI;
    }
    public double circleLengthDiametr(Point point1, Point point2) throws RemoteException{
        return lineLength(point1,point2)*PI;
    }
    public  double circleAreaDiametr(Point point1, Point point2) throws RemoteException{
        return pow(lineLength(point1,point2),2)*PI/4.;
    }
}
