package com.rozzer.lab.l05;

import com.rozzer.lab.l01.Lab;

public class LabKeeper {
    private Lab i;
    private volatile int current = 0;
    private Object lock = new Object();
    private boolean set = false;

    public LabKeeper(Lab i) {
        this.i = i;
    }

    public double read() throws InterruptedException {
        double val;
        synchronized(lock) {
            if (!canRead()) throw new InterruptedException();
            while (!set)
                lock.wait();
            val = i.getElement(current++);
            System.out.println("Read: " + val);
            set = false;
            lock.notifyAll();
        }
        return val;
    }

    public void write(double val) throws InterruptedException {
        synchronized(lock) {
            if (!canWrite()) throw new InterruptedException();
            while (set)
                lock.wait();
            i.setElement(current, val);
            System.out.println("Write: " + val);
            set = true;
            lock.notifyAll();
        }
    }

    public boolean canRead() {
        return current < i.getSize();
    }

    public boolean canWrite() {
        return (!set && current < i.getSize()) || (set && current < i.getSize() - 1);
    }

}
