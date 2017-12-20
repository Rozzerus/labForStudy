package com.rozzer.lab;

import com.rozzer.lab.l01.LabExperimentalDataModel01;
import com.rozzer.lab.l01.LabExperimentalDataModel02;
import com.rozzer.lab.l01.ManagerData;
import com.rozzer.lab.l05.ReadThread;
import com.rozzer.lab.l05.WriteThread;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;


@SpringBootApplication
@EnableScheduling
@EnableWebSocketMessageBroker
public class Main extends AbstractWebSocketMessageBrokerConfigurer {


    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);


        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{0,0,0,0,0}, 3,  1));
        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel02(new Double[]{0d,0d,0d,0d,0d}, 0d, 2));
        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{0,0,0,0,0}, 3,  1));
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

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/lab").withSockJS();
    }
}
