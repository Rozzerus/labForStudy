package com.rozzer.lab.l09;

import java.rmi.RMISecurityManager;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.util.Scanner;

public class Server  {

    public static void main(String[] args) {
        try {
            System.setProperty("java.security.policy", "server.policy");
            if (System.getSecurityManager() == null) {
                System.setSecurityManager(new RMISecurityManager());
            }

            WorkerImpl worker = new WorkerImpl();
            Worker stub = (Worker) UnicastRemoteObject.exportObject(worker, 0);
            Registry registry = LocateRegistry.getRegistry();
            registry.bind("server", stub);
            System.out.println("Object is registered.");
            System.out.println("Now server is waiting for client request...");

        } catch (Exception e) {
            System.out.println("CalculateServer exception: " + e.toString());
        }
        Scanner scanner = new Scanner(System.in);
        scanner.next();
    }


}

