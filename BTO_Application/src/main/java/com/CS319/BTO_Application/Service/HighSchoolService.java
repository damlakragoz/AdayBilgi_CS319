package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.HighschoolRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HighSchoolService {
    private final HighschoolRepos highschoolRepos;

    @Autowired
    public HighSchoolService(HighschoolRepos highschoolRepos) {
        this.highschoolRepos = highschoolRepos;
    }

    /**
     * Saves a high school entity to the database.
     *
     * Preconditions:
     * - The provided high school entity must not be null.
     *
     * Postconditions:
     * - The high school entity is saved or updated in the database.
     *
     * @param highSchool The high school entity to save.
     * @return The saved high school entity.
     */
    public HighSchool saveHighSchool(HighSchool highSchool){
        return highschoolRepos.save(highSchool);
    }

    /**
     * Retrieves a high school by its name.
     *
     * Preconditions:
     * - The school name must not be null or empty.
     *
     * @param name The name of the high school.
     * @return The high school entity with the specified name, or null if not found.
     */
    public HighSchool getSchoolByName(String name) {
        return highschoolRepos.findBySchoolName(name);
    }

    /**
     * Retrieves all counselors associated with a specific high school by its name.
     *
     * Preconditions:
     * - The school name must not be null or empty.
     *
     * Postconditions:
     * - Returns a list of counselors for the specified school.
     * - Throws an exception if no counselors are found.
     *
     * @param schoolName The name of the high school.
     * @return A list of counselors associated with the high school.
     * @throws IllegalArgumentException If no counselors are found for the specified school name.
     */
    public List<Counselor> getAllCounselors(String schoolName){
        List<Counselor> counselors = highschoolRepos.findAllCounselorsBySchoolName(schoolName);
        if (counselors.isEmpty()) {
            throw new IllegalArgumentException("No counselors found for the school name: " + schoolName);
        }
        return counselors;
    }

    /**
     * Retrieves all high schools from the database.
     *
     * @return A list of all high school entities.
     */
    public List<HighSchool> getAllHighSchools() {
        return highschoolRepos.findAll();
    }

    /**
     * Retrieves all high schools from the database.
     *
     * Note: This method is redundant as it duplicates the functionality of `getAllHighSchools`.
     *
     * @return A list of all high school entities.
     */
    public List<HighSchool> getAll() {
        return highschoolRepos.findAll();
    }
}
