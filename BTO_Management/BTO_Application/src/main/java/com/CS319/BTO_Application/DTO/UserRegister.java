package com.CS319.BTO_Application.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
public class UserRegister {
    private String username;
    private String password;
    private String role;
}