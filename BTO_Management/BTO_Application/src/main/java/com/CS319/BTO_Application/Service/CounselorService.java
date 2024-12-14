package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Repos.CounselorRepos;
import com.CS319.BTO_Application.Repos.SchoolTourApplicationRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CounselorService {

    private final CounselorRepos counselorRepos;
    private final SchoolTourApplicationRepos schoolTourApplicationRepos;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CounselorService(CounselorRepos counselorRepos, SchoolTourApplicationRepos schoolTourApplicationRepos, PasswordEncoder passwordEncoder) {
        this.counselorRepos = counselorRepos;
        this.schoolTourApplicationRepos = schoolTourApplicationRepos;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Counselor> getAllCounselors() {
        return counselorRepos.findAll();
    }

    public Counselor getCounselorByUsername(String username) {
        if (!counselorRepos.existsByEmail(username)) {
            System.out.println("Counselor Not Found with username: " + username);
            return null;
        }
        return counselorRepos.findByEmail(username);
    }

    public Counselor getCounselorById(Long id) {
        return counselorRepos.findById(id).orElseThrow(() ->
                new UsernameNotFoundException("Counselor not found with ID: " + id));
    }

    public Counselor saveCounselor(Counselor counselor) {
        counselor.setPassword(passwordEncoder.encode(counselor.getPassword()));
        return counselorRepos.save(counselor);
    }

    /**
     * Deletes a counselor by username and nullifies related tour applications.
     *
     * @param username the username of the counselor to delete
     */
    @Transactional
    public void deleteCounselorByUsername(String username) {
        Counselor counselor = counselorRepos.findByEmail(username);
        if (counselor == null) {
            throw new UsernameNotFoundException("Counselor not found: " + username);
        }

        // Nullify counselor_id in related SchoolTourApplications
        List<SchoolTourApplication> applications = schoolTourApplicationRepos.findByApplyingCounselor(counselor);
        applications.forEach(application -> application.setApplyingCounselor(null));

        counselorRepos.delete(counselor);
    }
}
