package com.CS319.BTO_Application.DTO;


import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddSchoolApplicationRequest {
    private SchoolTourApplication tourApplication;
    private Counselor counselor;
}
