package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HighschoolRepos extends JpaRepository<HighSchool, Integer> {
    HighSchool findBySchoolName(String name);
}
