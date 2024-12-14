package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Counselor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CounselorRepos extends UserRepos<Counselor> {

}
