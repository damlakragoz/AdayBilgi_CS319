package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepos extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    Boolean existsByUsername(String username);

    @Modifying // Needed for any update or delete custom query
    @Query("DELETE FROM User u WHERE u.username = :username")
    void deleteByUsername(String username);
}
