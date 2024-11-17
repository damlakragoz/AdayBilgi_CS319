package com.CS319.BTO_Application.repository;

import com.CS319.BTO_Application.entity.TourApplication;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.FluentQuery;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public interface TourApplicationRepository extends JpaRepository<TourApplication, Long> {

}
