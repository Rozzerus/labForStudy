package com.rozzer.lab.l01;

public class LabDTO<T> {

    private T max;

    private T min;

    private boolean haveStandard;

    public LabDTO(T max, T min, boolean haveStandard) {
        this.max = max;
        this.min = min;
        this.haveStandard = haveStandard;
    }

    public T getMax() {
        return max;
    }

    public T getMin() {
        return min;
    }

    public boolean isHaveStandard() {
        return haveStandard;
    }
}
