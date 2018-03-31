package com.rozzer.lab.l11.receiver;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;
import org.springframework.jms.config.JmsListenerContainerFactory;

import javax.sql.DataSource;


@SpringBootApplication
@EnableJms
public class MessagingListenerConfiguration {

    @Autowired
    private DataSource dataSource;

    @Bean
    public JmsListenerContainerFactory<?> myFactory() {
        DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
        factory.setConcurrency("1-1");
        factory.setPubSubDomain(true);
        factory.setConnectionFactory(new ActiveMQConnectionFactory("tcp://localhost:10002"));
        return factory;
    }

    @Bean
    public DataSource dataSource() {
        DataSource dataSource = null;
        DriverManagerDataSource managerDataSource = new DriverManagerDataSource();
        managerDataSource.setDriverClassName("org.postgresql.Driver");
        managerDataSource.setPassword("Qwe54321");
        managerDataSource.setUrl("jdbc:postgresql://localhost:5432/postgres");
        managerDataSource.setUsername("postgres");
        dataSource = managerDataSource;
        return dataSource;
    }

    @Bean
    public JdbcTemplate jdbcTemplate() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        jdbcTemplate.setDataSource(dataSource);
        return jdbcTemplate;
    }

    public static void main(String[] args) {
        // Launch the application
        ConfigurableApplicationContext context = SpringApplication.run(MessagingListenerConfiguration.class, args);

    }
}
