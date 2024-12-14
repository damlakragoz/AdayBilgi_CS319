package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/executive")
public class ExecutiveController {

    private final ExecutiveService executiveService;
    private final FairInvitationService fairInvitationService;
    private final UserService userService;

    @Autowired
    public ExecutiveController(ExecutiveService executiveService, FairInvitationService fairInvitationService, UserService userService) {
        this.executiveService = executiveService;
        this.fairInvitationService = fairInvitationService;
        this.userService = userService;

    }
}