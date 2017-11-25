package com.rozzer.lab;

import com.rozzer.lab.l01.Lab;
import com.rozzer.lab.l01.LabExperimentalDataModel01;
import com.rozzer.lab.l01.LabExperimentalDataModel02;
import com.rozzer.lab.l01.ManagerData;
import com.rozzer.lab.l05.ReadThread;
import com.rozzer.lab.l05.WriteThread;
import javafx.util.Pair;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;

import java.util.Collection;


@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan
public class Main extends SpringBootServletInitializer {


    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(Main.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);


        Lab lab1 = new LabExperimentalDataModel01(new Integer[]{0,0,0,0,0}, 3,  1);
        Lab lab2 = new LabExperimentalDataModel02(new Double[]{0d,0d,0d,0d,0d}, 0d, 2);
        Lab lab3 = new LabExperimentalDataModel01(new Integer[]{0,0,0,0,0}, 3,  1);


        ReadThread readThread = new ReadThread(new Runnable() {
            @Override
            public void run() {
                System.out.println(111);
            }
        });
        readThread.start();

        WriteThread writeThread = new WriteThread(new Runnable() {
            @Override
            public void run() {
                System.out.println(222);
            }
        });
        writeThread.start();
    }

    public static Collection<Pair<String, String>> getExperiments() {
        return ManagerData.getInstance().getExperiments();
    }

}
