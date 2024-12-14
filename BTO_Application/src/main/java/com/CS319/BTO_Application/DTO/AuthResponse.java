package com.CS319.BTO_Application.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
class AuthResponse {
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }
}
