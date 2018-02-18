package com.rozzer.lab.l09;

import java.rmi.Remote;

public interface WorkerRegistry extends Remote {
    String RMI__REGISTRY_KEY = "lab/rmi/registry";
    int RMI_PORT = 1099;

}
