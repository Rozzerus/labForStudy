package com.rozzer.lab.l09;

import java.io.IOException;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.Scanner;


public class Client {

    private  Scanner scanner = new Scanner(System.in);

    private final static Client CLIENT = new Client();

    public static void main(String[] args) throws IOException, NotBoundException {
        Worker worker = CLIENT.getWorkerByRMI();
        Point point1 = CLIENT.queryData();
        Point point2 = CLIENT.queryData();
        System.out.println("Line length:"+worker.lineLength(point1,point2));
        System.out.println("Circle length:"+worker.circleLength(point1,point2));
        System.out.println("Circle area:"+worker.circleArea(point1,point2));
        System.out.println("Circle length diametr:"+worker.circleLengthDiametr(point1,point2));
        System.out.println("Circle area diametr:"+worker.circleAreaDiametr(point1,point2));
    }


    private  Worker getWorkerByRMI() throws RemoteException, NotBoundException {
        Registry registry = LocateRegistry.getRegistry("localhost", 2099);
        return (Worker) registry.lookup("Workers");
    }

    private Point queryData(){
        System.out.print("x1:");
        double x = scanner.nextDouble();
        System.out.print("y1:");
        double y = scanner.nextDouble();
        return new Point(x, y);
    }
}
