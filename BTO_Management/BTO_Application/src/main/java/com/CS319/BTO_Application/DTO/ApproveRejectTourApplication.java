package com.CS319.BTO_Application.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApproveRejectTourApplication {
    private String coordinatorEmail;
    private Long tourApplicationId;
    private String status;
}
