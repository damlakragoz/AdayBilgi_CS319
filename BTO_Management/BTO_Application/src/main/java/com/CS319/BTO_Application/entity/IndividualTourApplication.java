package com.CS319.BTO_Application.Entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class IndividualTourApplication extends TourApplication {

    @Column(name = "applicant_name", nullable = true)
    private String applicantName; // Name of the applicant

    @Column(name = "applicant_surname", nullable = true)
    private String applicantSurname; // Surname of the applicant

    @Column(name = "phone_number", nullable = true)
    private String phoneNumber; // Contact phone number

    @Column(name = "email", nullable = true)
    private String email; // Contact email

    @Column(name = "extra_info", nullable = true)
    private String extraInformation; // Any extra information from the applicant
}