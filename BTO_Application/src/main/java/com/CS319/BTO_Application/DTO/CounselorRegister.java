package com.CS319.BTO_Application.DTO;

import com.CS319.BTO_Application.Entity.HighSchool;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
public class CounselorRegister {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String role;
    private String schoolName;
}