package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

//@NoRepositoryBean
public interface UserRepos<T extends User> extends JpaRepository<T, Long> {
    T findByUsername(String username);
    boolean existsByUsername(String username);

    @Modifying
    @Query("DELETE FROM #{#entityName} u WHERE u.username = :username")
    void deleteByUsername(@Param("username") String username);
}