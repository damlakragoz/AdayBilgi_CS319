package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Advisor;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.AdvisorRepos;
import com.CS319.BTO_Application.Repos.SchoolTourRepos;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdvisorService {

    private final AdvisorRepos advisorRepos;
    private final PasswordEncoder passwordEncoder;
    private final SchoolTourRepos schoolTourRepos;

    @Autowired
    public AdvisorService(AdvisorRepos advisorRepos, PasswordEncoder passwordEncoder, SchoolTourRepos schoolTourRepos) {
        this.advisorRepos = advisorRepos;
        this.passwordEncoder = passwordEncoder;
        this.schoolTourRepos = schoolTourRepos;
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

    /**
     * Retrieves all assigned unfinished tours for an advisor.
     *
     * Preconditions:
     * - `advisorEmail` must not be null and must correspond to an existing advisor.
     *
     * Postconditions:
     * - Returns a list of all assigned unfinished tours for the specified advisor.
     * - If the advisor does not exist, returns null.
     *
     * @param advisorEmail The email of the advisor.
     * @return A list of all assigned unfinished tours for the specified advisor or null.
     */
    public List<Tour> getAllAssignedUnfinishedTours(@RequestParam String advisorEmail) {
        List<Tour> tours = schoolTourRepos.findAll();
        List<Tour> activeToursAssignedToAdvisor = new ArrayList<>();
        if(getAdvisorByEmail(advisorEmail) == null){
            return null;
        }
        for(Tour tour: tours){
            if(tour.getAssignedGuide() != null){
                if(tour.getAssignedGuide().getEmail().equals(advisorEmail)){
                    if(tour.getTourStatus().equals("AdvisorAssigned")){
                        activeToursAssignedToAdvisor.add(tour);
                    }
                }
            }
        }
        for(Tour tour: activeToursAssignedToAdvisor){
            System.out.println("TOURRRR");
        }
        return activeToursAssignedToAdvisor; // Return the list of tours with a 200 OK status
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
