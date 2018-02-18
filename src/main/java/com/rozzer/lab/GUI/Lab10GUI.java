package com.rozzer.lab.GUI;

import com.rozzer.lab.l10.legacy.core.EventRunner;
import com.rozzer.lab.l10.legacy.objects.Person;
import javafx.application.Application;
import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.BorderPane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class Lab10GUI extends Application {

    private final String[] tabNames = {"View", "Editor", "Searching", "Log"};

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("HR base");
        Group root = new Group();
        Scene scene = new Scene(root, 500, 350, Color.WHITE);

        TabPane tabPane = new TabPane();
        BorderPane borderPane = new BorderPane();



        Tab tab = createTab(tabNames[0]);
        tabPane.getTabs().add(tab);

        TableView<Person> tableView = createTable();
        tab.setContent(tableView);

        tab = createTab(tabNames[1]);
        tabPane.getTabs().add(tab);
        tab = createTab(tabNames[2]);
        tabPane.getTabs().add(tab);
        tab = createTab(tabNames[3]);
        tabPane.getTabs().add(tab);


        borderPane.prefHeightProperty().bind(scene.heightProperty());
        borderPane.prefWidthProperty().bind(scene.widthProperty());
        borderPane.setCenter(tabPane);
        root.getChildren().add(borderPane);
//        root.getChildren().add(btn);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private Tab createTab(String tabName){
        Tab tab = new Tab();
        tab.setId(tabName);
        tab.setText(tabName);
        tab.setClosable(false);
        tab.setOnSelectionChanged((EventHandler) event -> EventRunner.getInstance().apply(event));
        return tab;
    }

    private TableView<Person> createTable(){
        TableView<Person> table = new TableView<>();
        table.setEditable(true);

        TableColumn firstNameCol = new TableColumn("First Name");
        firstNameCol.setMinWidth(100);
        firstNameCol.setCellValueFactory(new PropertyValueFactory<Person, String>("firstName"));

        TableColumn lastNameCol = new TableColumn("Last Name");
        lastNameCol.setMinWidth(100);
        lastNameCol.setCellValueFactory(new PropertyValueFactory<Person, String>("lastName"));

        TableColumn emailCol = new TableColumn("Email");
        emailCol.setMinWidth(200);
        emailCol.setCellValueFactory(new PropertyValueFactory<Person, String>("email"));

//        table.setItems(data);
        table.getColumns().addAll(firstNameCol, lastNameCol, emailCol);
        return table;
    }

}
