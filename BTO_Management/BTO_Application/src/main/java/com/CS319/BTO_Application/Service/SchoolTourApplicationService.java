
package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Repos.SchoolTourApplicationRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class SchoolTourApplicationService {
    private final SchoolTourApplicationRepos schoolTourApplicationRepos;
    private final UserRepos userRepos;

    @Autowired
    public SchoolTourApplicationService(SchoolTourApplicationRepos schoolTourApplicationRepos, UserRepos userRepos) {
        this.schoolTourApplicationRepos = schoolTourApplicationRepos;
        this.userRepos = userRepos;
    }

    /*
    Change:
        these tour applications will be saved to the SchoolTourApplicationRepos
     */
    public SchoolTourApplication addSchoolApplication(SchoolTourApplication schoolTourApplication, String counselorEmail) {
        Counselor counselor = (Counselor)userRepos.findByEmail(counselorEmail);
        schoolTourApplication.setApplyingCounselor(counselor);
        schoolTourApplication.setApplyingHighschool(counselor.getHighSchool());

        schoolTourApplication.setApplicationStatus("Created");

        // Şu anki zamanı al
        LocalDateTime now = LocalDateTime.now();

        // İşlem penceresini 2 dakika sonrası olarak ayarla
        LocalDateTime batchWindow = now.withSecond(0).withNano(0).plusMinutes(2);

        /*

        // Bir sonraki işlem penceresini belirle (ör. 23:59 bugünün sonu)
        LocalDateTime batchWindow = now.withHour(23).withMinute(59).withSecond(0);

        // Eğer şu anki zaman işleme penceresinden sonra ise, bir sonraki güne ayarla
        if (now.isAfter(batchWindow)) {
            batchWindow = batchWindow.plusDays(1);
        }

         */

        schoolTourApplication.setTransitionTime(batchWindow);

        return schoolTourApplicationRepos.save(schoolTourApplication);
    }

    public List<SchoolTourApplication> getAllSchoolTourApplications() {
        return schoolTourApplicationRepos.findAll();
    }

    public List<SchoolTourApplication> getAllSchoolTourApplicationsByCounselor(Counselor counselor) {
        return schoolTourApplicationRepos.findByApplyingCounselor(counselor);
    }

    public SchoolTourApplication getSchoolTourApplicationById(Long tourApplicationId) {
        return schoolTourApplicationRepos.findById(tourApplicationId)
                .orElseThrow(() -> new EntityNotFoundException("SchoolTourApplication not found with id: " + tourApplicationId));
    }

    public void deleteSchoolTourApplicationById(Long schoolTourApplicationId) {
        if(schoolTourApplicationRepos.existsById(schoolTourApplicationId)) {
            schoolTourApplicationRepos.deleteById(schoolTourApplicationId);
        }
        else{
            System.out.println("School Tour Application Not Found");
        }
    }




}


