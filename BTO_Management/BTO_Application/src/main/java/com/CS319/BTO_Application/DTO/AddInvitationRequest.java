package com.CS319.BTO_Application.DTO;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.FairInvitation;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddInvitationRequest {
    private FairInvitation fairInvitation;
    private String counselorUsername;
}

