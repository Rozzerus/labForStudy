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

    public Number read() throws InterruptedException {
        Number val;
        synchronized(lock) {
            if (!canRead()) throw new InterruptedException();
            while (!set)
                lock.wait();
            val = i.getElement(current++);
            System.out.println("Read: " + val +" from position " + current);
//            set = false;
            lock.notifyAll();
        }
        return val;
    }

    public void write(Number val) throws InterruptedException {
        synchronized(lock) {
            if (!canWrite()) throw new InterruptedException();
            while (set)
                lock.wait();
            this.current++;
            i.setElement(current-1, val);
            System.out.println("Write: " + i.getElement(this.current-1) + " from position " + this.current);
//            set = true;
            lock.notifyAll();
        }
    }

    public boolean isSet() {
        return set;
    }

    public void setSet(boolean set) {
        this.set = set;
    }

    public int getCurrent() {
        return current;
    }

    public void setCurrent(int current) {
        this.current = current;
    }

    public boolean canRead() {
        return current < i.getSize();
    }

    public boolean canWrite() {
        return (!set && current < i.getSize()) || (set && current < i.getSize() - 1);
    }

}
