package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
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

    /**
     * Retrieves all counselors from the database.
     *
     * @return List of all counselors.
     */
    public List<Counselor> getAllCounselors() {
        return counselorRepos.findAll();
    }

    /**
     * Retrieves a counselor by their username (email).
     *
     * Preconditions:
     * - The username must exist in the database.
     *
     * @param username The username (email) of the counselor.
     * @return The counselor if found, otherwise null.
     */
    public Counselor getCounselorByUsername(String username) {
        if(!counselorRepos.existsByEmail(username)){
            System.out.println("Counselor Not Found with username " + username);
            return null;
        }
        return counselorRepos.findByEmail(username);
    }

    /**
     * Saves a new counselor to the database with an encoded password.
     *
     * Preconditions:
     * - The counselor must have valid email and password fields.
     *
     * Postconditions:
     * - The counselor is persisted in the database with their password securely encoded.
     *
     * @param counselor The counselor to save.
     * @return The saved counselor.
     */
    public Counselor saveCounselor(Counselor counselor) {
        counselor.setPassword(passwordEncoder.encode(counselor.getPassword())); //setPassword is new for this one
        return counselorRepos.save(counselor);
    }

    /**
     * Deletes a counselor by their username (email) and nullifies their related tour applications.
     *
     * Preconditions:
     * - The username must exist in the database.
     *
     * Postconditions:
     * - The counselor is removed from the database.
     * - Any school tour applications associated with the counselor will have their
     *   `applyingCounselor` field set to null.
     *
     * @param username The username (email) of the counselor to delete.
     * @throws UsernameNotFoundException If the counselor does not exist.
     */
    @Transactional
    public void deleteCounselorByUsername(String username) {
        Counselor counselor = counselorRepos.findByEmail(username);
        if (counselor == null) {
            throw new UsernameNotFoundException("Counselor not found: " + username);
        }

        // Set counselor_id to null in related entities
        List<SchoolTourApplication> applications = schoolTourApplicationRepos.findByApplyingCounselor(counselor);
        for (SchoolTourApplication application : applications) {
            application.setApplyingCounselor(null);
        }
        counselorRepos.delete(counselor);
    }
}
