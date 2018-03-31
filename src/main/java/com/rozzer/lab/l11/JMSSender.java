package com.rozzer.lab.l11;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jms.*;

public class JMSSender {



    private static JMSSender INSTANCE;

    public static JMSSender getInstance() {
        return INSTANCE;
    }

    @Autowired
    private ActiveMQConnectionFactory connectionFactory;

    private String destinationName;
    private boolean isTopic;

    private Connection connection;
    private Session session;
    private MessageProducer producer;


    public void init(){
        try {
            INSTANCE = this;
            connection = connectionFactory.createConnection();
            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            Destination destination = (isTopic) ? session.createTopic(destinationName) : session.createQueue(destinationName);
            producer = session.createProducer(destination);
            producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
            producer.setTimeToLive(1000*60);
        } catch (JMSException e) {
            System.out.println("Creating session error");
            throw new RuntimeException(e);
        }
    }

    public void destroy(){
        if (producer != null) {
            try {
                producer.close();
                producer = null;
            } catch (JMSException e) {
                System.out.println("Finishing producer error");
                throw new RuntimeException(e);

            }
        }
        if (session != null) {
            try {
                session.close();
                session = null;
            } catch (JMSException e) {
                System.out.println("Finishing session error");
                throw new RuntimeException(e);

            }
        }
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setTopic(boolean topic) {
        this.isTopic = topic;
    }

    public boolean isTopic() {
        return isTopic;
    }

    public void send(String text, long time, String id, String type) {
        try {
            _send(text, time, id, type);
        } catch (JMSException e) {
            System.out.println("Possible disconnect: JMSException, will retry to establish");
            this.destroy();
            this.init();
            try {
                _send(text, time, id, type);
            } catch (JMSException e1) {
                System.out.println("Error retrying send message");
                throw new RuntimeException(e1);
            }
        }

    }

    private void _send(String text, long time, String id, String type) throws JMSException {
        TextMessage message = session.createTextMessage(text);
        message.setLongProperty("Time", time);
        message.setStringProperty("ObjectID", id);
        message.setStringProperty("ObjectType", type);
        producer.send(message);
    }

    public void setConnectionFactory(ActiveMQConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    public ActiveMQConnectionFactory getConnectionFactory() {
        return connectionFactory;
    }
}
