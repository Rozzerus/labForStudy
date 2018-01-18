package com.rozzer.lab.l06;


import com.rozzer.lab.l01.Lab;
import com.rozzer.lab.l01.LabExperimentalDataModel01;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;


public class Client {

        private String ipAddress;
        private int port;

        public Client(String ipAddress, int port) {
            this.ipAddress = ipAddress;
            this.port = port;

        }
        public void process() {
            try {
                InetAddress host = InetAddress.getByName(ipAddress);
                Socket s = new Socket(host, port);
                processRequest(s);
            } catch (UnknownHostException ex) {
                System.out.println(
                        "Невозможно установить соединение");
            } catch (IOException ex) {
                System.out.println(
                        "Ошибка ввода/вывода в ходе работы");
            } catch (ClassNotFoundException ex) {
                System.out.println("Неизвестный класс отклика");
            }
        }

        private void processRequest(Socket s) throws IOException, ClassNotFoundException {
            ObjectOutputStream out = new
                    ObjectOutputStream(s.getOutputStream());
            ObjectInputStream in = new
                    ObjectInputStream(s.getInputStream());

            //DataInputStream answerIn = new DataInputStream(s.getInputStream());

            Object obj;
            Lab lab;
            Double servAnswer;

            out.writeObject(true);
            Integer[] quantity = {2,3,4,5};
            lab = new LabExperimentalDataModel01(quantity, 2, 1);
            out.writeObject(lab);
            System.out.println("Send: " + lab.toString());

            out.flush();

            servAnswer = in.readDouble();
            System.out.println("Receive: " + servAnswer.toString());

            in.close();
            out.close();
            s.close();
        }
        public static void main(String[] args) {
            Client client = new Client("localhost",4320);

            client.process();


        }


}
