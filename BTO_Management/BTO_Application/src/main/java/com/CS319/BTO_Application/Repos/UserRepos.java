package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepos extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}
