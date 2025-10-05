package com.accounttool;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AccountingGstApplication {

    public static void main(String[] args) {
        // Load .env file if it exists
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./backend")
                    .ignoreIfMissing()
                    .load();
            dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
        } catch (Exception e) {
            System.out.println("No .env file found, using default configuration");
        }
        
        SpringApplication.run(AccountingGstApplication.class, args);
    }
}
