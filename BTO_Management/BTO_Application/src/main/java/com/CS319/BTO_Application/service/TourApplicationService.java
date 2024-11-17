package com.CS319.BTO_Application.service;

import com.CS319.BTO_Application.entity.TourApplication;
import com.CS319.BTO_Application.repository.TourApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourApplicationService {
    private final TourApplicationRepository tourApplicationRepository;

    @Autowired
    public TourApplicationService(TourApplicationRepository tourApplicationRepository) {
        this.tourApplicationRepository = tourApplicationRepository;
    }

    public List<TourApplication> getAllTourApplications() {
        return tourApplicationRepository.findAll();
    }
}
