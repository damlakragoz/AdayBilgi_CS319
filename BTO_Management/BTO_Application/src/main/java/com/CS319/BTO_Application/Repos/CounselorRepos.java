package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Counselor;

import java.util.Optional;

public interface CounselorRepos extends UserRepos<Counselor> {
    Optional<Counselor> findById(Long id); // Find by counselor ID
    boolean existsById(Long id); // Check existence by counselor ID
}
