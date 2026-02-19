package com.church.t1.exception;

public class StudentAlreadyRegisteredException extends RuntimeException {

    public StudentAlreadyRegisteredException(String message) {
        super(message);
    }
}