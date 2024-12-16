package com.CS319.BTO_Application.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
public class TourGuideRegister {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    String department;
    int grade;
    String iban;

}