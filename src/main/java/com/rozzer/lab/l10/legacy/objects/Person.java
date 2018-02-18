package com.rozzer.lab.l10.legacy.objects;

public class Person {
    private String firstName;
    private String lastName;
    private String email;

    public Person(String fName, String lName, String email) {
        this.firstName = fName;
        this.lastName = lName;
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String fName) {
        firstName = fName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lName) {
        lastName = lName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}
