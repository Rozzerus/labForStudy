package com.rozzer.lab.l06;

import com.rozzer.lab.l01.Lab;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class ServerParallel {
        private int port;

    public ServerParallel(int port) {
            this.port = port;
        }

    private class RequestThread extends Thread {
        private Socket s;
        public RequestThread(Socket socket) {
            s = socket;
        }
        @Override
        public void run() {
            System.out.println(
                    "Установлено соединение с клиентом");
            processRequest(s);
        }
    }

        public void process() {
            try {
                ServerSocket ss = new ServerSocket(port);
                System.out.println("Сервер запущен");
                Socket s;
                while (true) {
                    try {
                        s = ss.accept();
                        (new RequestThread(s)).start();
                    } catch (IOException ex) {
                        System.out.println(
                                "Ошибка при установлении связи");
                    }
                }
            } catch (IOException ex) {
                System.out.println("Невозможно открыть порт");
            }
        }

        private void processRequest(Socket s) {
            ObjectOutputStream objOut = null;
            ObjectInputStream objIn = null;
            try {
                objOut = new ObjectOutputStream(s.getOutputStream());
                objIn = new ObjectInputStream(s.getInputStream());
                Lab lab;
                int result;
                while (((Boolean) objIn.readObject()).booleanValue()) {
                    lab = (Lab) objIn.readObject();
                    System.out.println("Получен объект " +
                            lab.toString());
                    try {
                        result = lab.getId();
                        objOut.writeDouble(result);
                        System.out.println(
                                "Отправлен результат выполнения метода " +
                                        result);
                    } catch (Exception ex) {
                        objOut.writeObject(ex);
                        System.out.println("Отправлено исключение");
                    }
                    objOut.flush();
                }
            } catch (IOException ex) {
                System.out.println(
                        "Ошибка ввода/вывода при работе с клиентом");
            } catch (ClassNotFoundException ex) {
                System.out.println("Неизвестный класс в запросе");
            } finally {
                try {
                    objIn.close();
                } catch (Throwable ex) {
                }
                try {
                    objOut.close();
                } catch (Throwable ex) {
                }
                try {
                    s.close();
                } catch (Throwable ex) {
                }
            }
        }

        public static void main(String[] args) {

            ServerParallel s =
                    new ServerParallel(4320);
            s.process();
        }
    }

