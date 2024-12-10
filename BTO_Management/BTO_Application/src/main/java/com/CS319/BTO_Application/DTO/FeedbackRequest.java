package com.CS319.BTO_Application.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FeedbackRequest {
    private Long tourId;
    private int rating;
    private String comment;
}
