package com.bibimartins;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BibimartinsApplication {
    public static void main(String[] args) {
        SpringApplication.run(BibimartinsApplication.class, args);
    }
}
