package com.CS319.BTO_Application.Controller;
//import com.CS319.BTO_Application.Service.UserService;
import com.CS319.BTO_Application.Service.CounselorService;
import com.CS319.BTO_Application.Service.HighSchoolService;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/counselor")
public class CounselorController {

    private final CounselorService counselorService;
    private final HighSchoolService highschoolService;

    @Autowired
    public CounselorController(CounselorService counselorService, HighSchoolService highschoolService) {
        this.counselorService = counselorService;
        this.highschoolService = highschoolService;
    }
}




