package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HighschoolRepos extends JpaRepository<HighSchool, Integer> {
    HighSchool findBySchoolName(String name);
    @Query("SELECT c FROM Counselor c WHERE c.highSchool.schoolName = :schoolName")
    List<Counselor> findAllCounselorsBySchoolName(@Param("schoolName") String schoolName);
}
