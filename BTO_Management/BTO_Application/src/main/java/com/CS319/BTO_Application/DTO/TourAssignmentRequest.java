package com.CS319.BTO_Application.DTO;

import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.Tour;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TourAssignmentRequest {
    private Long tourId;
    private String applyingGuideEmail;
}
