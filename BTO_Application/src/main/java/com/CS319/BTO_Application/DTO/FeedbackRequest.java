package com.CS319.BTO_Application.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {
    private Long tourId;
    private int rating;
    private String comment;
}
