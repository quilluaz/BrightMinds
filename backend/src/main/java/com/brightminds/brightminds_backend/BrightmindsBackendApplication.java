package com.brightminds.brightminds_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.brightminds.brightminds_backend")
public class BrightmindsBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BrightmindsBackendApplication.class, args);
    }
}