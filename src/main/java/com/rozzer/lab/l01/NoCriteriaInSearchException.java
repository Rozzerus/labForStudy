package com.rozzer.lab.l01;

public class NoCriteriaInSearchException extends RuntimeException {
    public NoCriteriaInSearchException() {
    }

    public NoCriteriaInSearchException(String message) {
        super(message);
    }

    public NoCriteriaInSearchException(String message, Throwable cause) {
        super(message, cause);
    }
}
