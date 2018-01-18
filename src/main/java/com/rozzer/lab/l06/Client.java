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

        private String ip;
        private int port;

        public Client(String ip, int port) {
            this.ip = ip;
            this.port = port;

        }
        public void process() {
            try {
                InetAddress host = InetAddress.getByName(ip);
                Socket s = new Socket(host, port);
                processRequest(s);
            } catch (UnknownHostException ex) {
                System.out.println("Connection is fail:" + ex.getMessage());
            } catch (IOException ex) {
                System.out.println("I/O Exception: ");
                ex.printStackTrace();
            } catch (ClassNotFoundException ex) {
                System.out.println("ClassNotFoundException: " + ex.getMessage());
            }
        }

        private void processRequest(Socket socket) throws IOException, ClassNotFoundException {
            ObjectOutputStream outputStream = null;
            ObjectInputStream inputStream = null;
            try {
                outputStream = new ObjectOutputStream(socket.getOutputStream());
                inputStream = new ObjectInputStream(socket.getInputStream());

                Lab lab;
                outputStream.writeObject(true);
                lab = new LabExperimentalDataModel01(new Integer[]{2, 3, 4, 5}, 2, 1);
                outputStream.writeObject(lab);
                System.out.println("Send: " + lab.toString());

                outputStream.flush();

                Integer answer = inputStream.readInt();
                System.out.println("Receive: sended object's id : " + answer.toString());
            } finally {
                Util.closing(inputStream);
                Util.closing(outputStream);
                Util.closing(socket);
            }

        }
        public static void main(String[] args) {
            Client client = new Client("localhost",4320);
            client.process();
        }


}
