package com.rozzer.lab.l09;

import java.rmi.Remote;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class Server {

    public static void main(String[] args) {
        try {
            final Registry registry = LocateRegistry.createRegistry(2099);
            final Worker worker = new WorkerImpl();
            Remote stub = UnicastRemoteObject.exportObject(worker, 0);
            registry.bind("Workers", stub);
            while (true) {
                Thread.yield();
            }
        }
        catch (Exception e) {
            throw new RuntimeException("Server exception: " + e.toString());
        }
    }


}

