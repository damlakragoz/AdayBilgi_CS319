package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.HighschoolRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HighSchoolService {
    private final HighschoolRepos highschoolRepos;

    @Autowired
    public HighSchoolService(HighschoolRepos highschoolRepos) {
        this.highschoolRepos = highschoolRepos;
    }
    public HighSchool saveHighSchool(HighSchool highSchool){
        return highschoolRepos.save(highSchool);
    }

    public HighSchool getSchoolByName(String name) {
        return highschoolRepos.findBySchoolName(name);
    }

    public List<Counselor> getAllCounselors(String schoolName){
        List<Counselor> counselors = highschoolRepos.findAllCounselorsBySchoolName(schoolName);
        if (counselors.isEmpty()) {
            throw new IllegalArgumentException("No counselors found for the school name: " + schoolName);
        }
        return counselors;
    }
}
