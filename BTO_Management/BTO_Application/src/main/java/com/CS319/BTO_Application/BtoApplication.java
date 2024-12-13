package com.CS319.BTO_Application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.CS319.BTO_Application.entity")
public class BtoApplication {

	public static void main(String[] args) {
		System.out.println("BTO Application");
		SpringApplication.run(BtoApplication.class, args);
	}

}
