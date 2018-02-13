package com.rozzer.lab.l09;

import java.io.Serializable;
import java.rmi.Remote;
import java.rmi.RemoteException;

public interface Worker extends Remote , Serializable {
    double lineLength(Point point1, Point point2) throws RemoteException;

    double circleLength(Point point1, Point point2)  throws RemoteException;

    double circleArea(Point point1, Point point2) throws RemoteException;

    double circleLengthDiametr(Point point1, Point point2) throws RemoteException;

    double circleAreaDiametr(Point point1, Point point2) throws RemoteException;
}
