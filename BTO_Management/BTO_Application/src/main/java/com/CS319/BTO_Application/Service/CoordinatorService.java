package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Coordinator;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Repos.CoordinatorRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoordinatorService {
    private final CoordinatorRepos coordinatorRepos;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public CoordinatorService(CoordinatorRepos coordinatorRepos, PasswordEncoder passwordEncoder) {
        this.coordinatorRepos = coordinatorRepos;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Coordinator> getAllCoordinators() {
        return coordinatorRepos.findAll();
    }

    public Coordinator getCoordinatorByUsername(String username) {
        if(!coordinatorRepos.existsByUsername(username)){
            System.out.println("Coordinator Not Found with username " + username);
            return null;
        }
        return coordinatorRepos.findByUsername(username);
    }
    public Coordinator saveCoordinator(Coordinator coordinator) {
        coordinator.setPassword(passwordEncoder.encode(coordinator.getPassword())); //setPassword is new for this one
        return coordinatorRepos.save(coordinator);
    }

    //we may need to remove notifications etc of
    // the coordinator in the future in this method
    @Transactional
    public void deleteCoordinatorByUsername(String username) {
        Coordinator coordinator = coordinatorRepos.findByUsername(username);
        if (coordinator == null) {
            throw new UsernameNotFoundException("Coordinator not found: " + username);
        }
        coordinatorRepos.delete(coordinator);
    }

}
