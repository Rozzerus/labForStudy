package com.rozzer.lab.l06;

import com.rozzer.lab.l01.Lab;

import java.io.EOFException;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {
    private int port;

    public Server(int port) {
        this.port = port;
    }

    private class RequestThread extends Thread {
        private Socket socket;
        public RequestThread(Socket socket) {
            this.socket = socket;
        }
        @Override
        public void run() {
            System.out.println("Connected");
            processRequest(this.socket);
        }
    }

    public void process() {
        try {
            ServerSocket serverSocket = new ServerSocket(port);
            System.out.println("Server running");
            Socket socket;
            while (true) {
                try {
                    socket = serverSocket.accept();
                    (new RequestThread(socket)).start();
                } catch (IOException ex) {
                    System.out.println("Connection error" + ex.getMessage());
                }
            }
        } catch (IOException ex) {
            System.out.println("Port blocked" + ex.getMessage());
        }
    }

    private void processRequest(Socket socket) {
        ObjectOutputStream outputStream = null;
        ObjectInputStream inputStream = null;
        try {
            outputStream = new ObjectOutputStream(socket.getOutputStream());
            inputStream = new ObjectInputStream(socket.getInputStream());
            Lab lab;
            int result;
            while (((Boolean) inputStream.readObject()).booleanValue()) {
                lab = (Lab) inputStream.readObject();
                System.out.println("Receive: " + lab.toString());
                try {
                    result = lab.getId();
                    outputStream.writeInt(result);
                    System.out.println("Send object's id: " + result);
                } catch (Exception ex) {
                    outputStream.writeObject(ex);
                    System.out.println("Send exception:" + ex.getMessage());
                }
                outputStream.flush();
            }
        } catch (EOFException ex){
            System.out.println("Client disconnected" );
        } catch (IOException ex) {
            System.out.println("I/O Exception:" );
            ex.printStackTrace();
        } catch (ClassNotFoundException ex) {
            System.out.println("ClassNotFoundException: " + ex.getMessage());
        } finally {
            Util.closing(inputStream);
            Util.closing(outputStream);
            Util.closing(socket);
        }
    }


    public static void main(String[] args) {
        Server s = new Server(4320);
        s.process();
    }
}

