package com.rozzer.lab.l10.legacy;

import com.rozzer.lab.GUI.Lab10GUI;
import com.rozzer.lab.l10.legacy.objects.Person;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

public class Client {

    private static Client INSTANCE = new Client();

    private final ObservableList<Person> data =
            FXCollections.observableArrayList(
                    new Person("Jacob", "Smith", "jacob.smith@example.com"),
                    new Person("Isabella", "Johnson", "isabella.johnson@example.com"),
                    new Person("Ethan", "Williams", "ethan.williams@example.com"),
                    new Person("Emma", "Jones", "emma.jones@example.com"),
                    new Person("Michael", "Brown", "michael.brown@example.com")
            );

    private Client() {
    }

    public static void main(String[] args) {
        Lab10GUI.main(args);

    }

    public static Client getInstance() {
        return INSTANCE;
    }


    protected ObservableList<Person> getAllPersonData(){
        return data;
    }

}
