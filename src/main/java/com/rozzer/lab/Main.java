package com.rozzer.lab;

import com.rozzer.lab.l01.LabExperimentalDataModel01;
import com.rozzer.lab.l01.ManagerData;
import com.rozzer.lab.l05.LabKeeper;
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
//        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel02(new Double[]{0d,0d,0d,0d,0d}, 0d, 2));
//        ManagerData.getInstance().getLabData().add(new LabExperimentalDataModel01(new Integer[]{0,0,0,0,0}, 3,  3));//


        ManagerData.getInstance().getLabData().forEach(lab -> {
                LabKeeper keeper = new LabKeeper(lab);

                WriteThread writeThread = new WriteThread(new Runnable() {
                    @Override
                    public void run() {

                        for (int i = 0; i < lab.getSize(); i++) {
                            Number number = (Math.random() * 10);
                            try {
                                keeper.write(number);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                        keeper.setCurrent(0);
                        keeper.setSet(true);
                    }
                });
                writeThread.setPriority(Thread.MIN_PRIORITY);


                ReadThread readThread = new ReadThread(new Runnable() {
                    @Override
                    public void run() {
                        for (int i = 0; i < lab.getSize(); i++) {
                            try {
                                keeper.read();
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                        keeper.setSet(false);
                    }
                });
                readThread.setPriority(Thread.MAX_PRIORITY);

                readThread.start(); writeThread.start();

        });

    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/lab").withSockJS();
    }
}
