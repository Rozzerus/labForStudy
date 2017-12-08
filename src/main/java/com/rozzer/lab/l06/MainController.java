package com.rozzer.lab.l06;

import com.rozzer.lab.l01.Lab;
import com.rozzer.lab.l01.ManagerData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

@Controller
public class MainController {

        @Autowired
        private SimpMessagingTemplate simpMessagingTemplate;

        @MessageMapping("/lab")
        public void receiveColor(Lab lab){
            System.out.println("message.getColorString() = " + lab.toString());
        }


        @Scheduled(fixedDelay = 1000)
        private void bgColor(){
            for (Lab lab:  ManagerData.getInstance().getLabData()) {
                simpMessagingTemplate.convertAndSend("/topic/lab", lab);
                System.out.println("Send color: " + lab.toString());
            }
        }

}
