package com.rozzer.lab.l01;

public class NoClassForCreateException extends Exception {
    public NoClassForCreateException(String s, ReflectiveOperationException e) {

    }

    public NoClassForCreateException() {
    }

    public NoClassForCreateException(String message) {
        super(message);
    }

    public NoClassForCreateException(String message, Throwable cause) {
        super(message, cause);
    }
}
