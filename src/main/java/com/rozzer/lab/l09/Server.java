package com.rozzer.lab.l09;

import java.rmi.Remote;
import java.rmi.registry.LocateRegistry;
import java.rmi.server.UnicastRemoteObject;

public class Server {

    public static void main(String[] args) {
        try {
//            Runtime.getRuntime().exec("rmiregistry 2099");
//            System.setProperty("java.rmi.server.hostname","127.0.0.1");
//            //Runtime.getRuntime().exec("start rmiregistry");
//
//            String[] command = new String[]{"rmiregistry","2099"};
//            Runtime.getRuntime().exec(command);
            WorkerRegistry workerRegistry = (WorkerRegistry) LocateRegistry.getRegistry(WorkerRegistry.RMI_PORT).lookup(WorkerRegistry.RMI__REGISTRY_KEY);
            final Worker worker = new WorkerImpl();
            Remote stub = UnicastRemoteObject.exportObject(worker, 0);
//            workerRegistry.bind("Workers", stub);
            while (true) {
                Thread.yield();
            }
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}

