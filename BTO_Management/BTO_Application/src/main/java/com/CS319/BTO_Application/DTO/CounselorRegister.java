package com.CS319.BTO_Application.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CounselorRegister {
    private String username;
    private String password;
    private String role;
    private String schoolName;
}
