package com.rozzer.lab.l09;

import java.rmi.RMISecurityManager;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class Server  {

    public static void main(String[] args) {
        try {
            System.setProperty("java.security.policy", "D:\\study\\labForStudy\\src\\main\\resources\\server.policy");
            if (System.getSecurityManager() == null) {
                System.setSecurityManager(new RMISecurityManager());
            }

            WorkerImpl worker = new WorkerImpl();
            Worker stub = (Worker) UnicastRemoteObject.exportObject(worker, 0);

            Registry registry = LocateRegistry.getRegistry();
            registry.bind("Workers", stub);
            while (true) {
                Thread.yield();
            }
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}

