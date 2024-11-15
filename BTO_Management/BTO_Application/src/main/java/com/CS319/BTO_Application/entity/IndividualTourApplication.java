package com.CS319.BTO_Application.entity;
import jakarta.persistence.*;
@Entity
public class IndividualTourApplication extends TourApplication {

    private String applicantName; // Name of the applicant
    private String applicantSurname; // Surname of the applicant
    private String phoneNumber; // Contact phone number
    private String email; // Contact email
    private String extraInformation; // Any extra information from the applicant

    // Getters and Setters
    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getApplicantSurname() {
        return applicantSurname;
    }

    public void setApplicantSurname(String applicantSurname) {
        this.applicantSurname = applicantSurname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getExtraInformation() {
        return extraInformation;
    }

    public void setExtraInformation(String extraInformation) {
        this.extraInformation = extraInformation;
    }

    // Method to apply for an individual tour
    public boolean applyForIndividualTour() {
        // Implementation for applying an individual tour (e.g., validation, processing)
        // Return true if successful, false otherwise
        return true;
    }
}
