package com.rozzer.lab.l11.receiver;

import com.google.common.base.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import javax.jms.Message;
import javax.jms.MessageListener;
import java.sql.Timestamp;

@Component
public class JMSListener implements MessageListener {


    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @JmsListener(destination = "ForLab", containerFactory = "myFactory")
    public void onMessage(Message message) {
        try {
            long timeStamp = message.getLongProperty("Time");
            String objectID = message.getStringProperty("ObjectID");
            String objectType = message.getStringProperty("ObjectType");
            if (Strings.isNullOrEmpty(objectID)){
                objectID = getLastID();
            }
            log(objectID, new Timestamp(timeStamp), objectType);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    private String getLastID(){//TODO: IT'S HACK
        SqlRowSet rowSet = jdbcTemplate.queryForRowSet("SELECT last_value FROM lab.id_seq;");
        rowSet.next();

        return rowSet.getString("last_value");
    }

    private void log(String id, Timestamp date, String name){
        jdbcTemplate.execute("INSERT INTO lab.emp_change (change_emp, change_data, change_name) values (" + id + ", '" +date+"', '"+name+"');");
    }
}
