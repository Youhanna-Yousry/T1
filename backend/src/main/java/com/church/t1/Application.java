package com.church.t1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Application {

    private Application() {
    }

    static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
