package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Advisor;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.AdvisorRepos;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvisorService {

    private final AdvisorRepos advisorRepos;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdvisorService(AdvisorRepos advisorRepos, PasswordEncoder passwordEncoder) {
        this.advisorRepos = advisorRepos;
        this.passwordEncoder = passwordEncoder;
    }

    public Advisor getAdvisorByEmail(String email) {
        if (!advisorRepos.existsByEmail(email)) {
            System.out.println("Advisor Not Found with email " + email);
            return null;
        }
        return advisorRepos.findByEmail(email);
    }

    public List<Advisor> getAllAdvisors() {
        return advisorRepos.findAllAdvisors();
    }

    public Advisor saveAdvisor(Advisor advisor) {
        advisor.setPassword(passwordEncoder.encode(advisor.getPassword())); //setPassword is new for this one
        return advisorRepos.save(advisor);
    }

    @Transactional
    public void deleteAdvisorByEmail(String email) {
        Advisor advisor = advisorRepos.findByEmail(email);
        if (advisor == null) {
            throw new UsernameNotFoundException("Advisor not found: " + email);
        }
        advisorRepos.delete(advisor);
    }
}
